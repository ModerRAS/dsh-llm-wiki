import { describe, expect, it } from "vitest";
import { createInjectedUserMessage } from "../../src/dsh/injected-message.js";

/** DSH `MessageId`s are UUIDv4 strings (`createMessage` → `brandString(randomUUID())`). */
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("createInjectedUserMessage (DSH user/message contract)", () => {
  it("stamps the identity the session restore validator requires", () => {
    const message = createInjectedUserMessage("recalled 3 page(s)", { kind: "llm-wiki-recall" });

    // Regression: a pre-step injection without `id` used to persist a
    // `user/message` event that DSH then refused to load:
    // `session event at seq N lacks an identified message`.
    expect(message.id).toMatch(UUID_V4);
    expect(message.role).toBe("user");
    expect(message.content).toEqual([{ type: "text", text: "recalled 3 page(s)" }]);
    expect(message.source).toEqual({ kind: "llm-wiki-recall" });
  });

  it("mints a fresh id per injection", () => {
    const ids = new Set(
      Array.from(
        { length: 50 },
        () => createInjectedUserMessage("x", { kind: "llm-wiki-reminder" }).id,
      ),
    );
    expect(ids.size).toBe(50);
  });

  it("passes an unknown source kind through untouched", () => {
    // DSH keeps unknown `source.kind` values for forward compatibility; only a
    // non-empty string is required. The helper must not normalize it away.
    const message = createInjectedUserMessage("t", { kind: "llm-wiki-reminder", turn: 5 });
    expect(message.source).toEqual({ kind: "llm-wiki-reminder", turn: 5 });
  });
});
