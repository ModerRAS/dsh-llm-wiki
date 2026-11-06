import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DshRuntime } from "../../src/dsh/background.js";
import { installRecallInjection } from "../../src/dsh/recall-inject.js";
import type { DshContext, PreStepDecision } from "../../src/dsh/types.js";

// Only the retrieval layer is stubbed: this suite is about the SHAPE of the
// injected message, not about ranking. Keeping `importOriginal` preserves every
// other export the surrounding module graph imports.
vi.mock("../../extensions/llm-wiki/lib/recall.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../extensions/llm-wiki/lib/recall.js")>();
  return {
    ...actual,
    searchWikiHybrid: vi.fn(async () => [
      {
        id: "concepts/retrieval",
        title: "Retrieval",
        type: "concept",
        preview: "Retrieval preview",
        path: "/vault/.llm-wiki/wiki/concepts/retrieval.md",
        score: 1,
      },
    ]),
    formatRecallContext: vi.fn(() => "## Relevant Wiki Knowledge\n\n- [[concepts/retrieval]]"),
    shouldUseLinksFirst: vi.fn(() => true),
    vaultPageCount: vi.fn(() => 12),
  };
});

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

type Listener = (
  payload: Record<string, unknown>,
  next: () => Promise<PreStepDecision>,
) => Promise<PreStepDecision>;

describe("recall injection message shape", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "llm-wiki-recall-inject-"));
    mkdirSync(join(cwd, ".llm-wiki"), { recursive: true });
    writeFileSync(join(cwd, ".llm-wiki", "config.json"), "{}\n");
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  function harness(): Map<string, unknown> {
    const listeners = new Map<string, unknown>();
    const ctx = {
      on: (event: string, listener: unknown) => {
        listeners.set(event, listener);
        return () => listeners.delete(event);
      },
      effect: () => () => undefined,
      workingDirectory: { get: () => cwd },
      logger: { info: () => undefined, warn: () => undefined },
    } as unknown as DshContext;
    // `drainOnPressure` only touches `pendingCount`; nothing is queued here.
    const runtime = { pendingCount: () => 0 } as unknown as DshRuntime;
    installRecallInjection(ctx, runtime);
    return listeners;
  }

  it("appends an identified user message after the claimed prompt", async () => {
    const listeners = harness();
    const listener = listeners.get("agent/pre-step") as Listener;
    expect(listener).toBeTypeOf("function");

    const decision = await listener(
      {
        // Unique per run: the injector dedupes one injection per (session, turn)
        // in module state that survives between tests.
        agent: { session: { id: `recall-${Math.random().toString(36).slice(2)}` } },
        messages: [{ role: "user", content: "what is retrieval" }],
        turn: 1,
        step: 1,
      },
      async () => ({ kind: "enter", messages: [{ role: "user", content: "what is retrieval" }] }),
    );

    expect(decision.kind).toBe("enter");
    expect(decision.messages).toHaveLength(2);
    const injected = decision.messages?.[1] as {
      id?: string;
      role?: string;
      content?: Array<{ type: string; text: string }>;
      source?: { kind?: string };
    };
    // Regression: without `id` this entry persisted as an event DSH could not
    // restore ("session event at seq N lacks an identified message"), which
    // made the whole session log unloadable.
    expect(injected.id).toMatch(UUID_V4);
    expect(injected.role).toBe("user");
    expect(injected.source).toEqual({ kind: "llm-wiki-recall" });
    expect(injected.content?.[0]?.text).toContain("Relevant Wiki Knowledge");
  });
});
