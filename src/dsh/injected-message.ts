/**
 * Builders for the messages this plugin injects through `agent/pre-step`.
 *
 * DSH persists every accepted `decision.messages` entry as a `user/message`
 * session event, but the restore path validates those events separately: a
 * message event must carry a non-empty `id`, otherwise loading the session
 * fails with
 *
 *   stored session "<session>" is corrupt: … failed validation:
 *   session event at seq N lacks an identified message
 *
 * — and the *whole* session becomes unloadable, not just that event. The live
 * write path does not check the id, so a hand-rolled message literal is only
 * discovered on the next cold read. Every injection therefore has to be a
 * complete DSH message, and this helper is the single place that guarantees it
 * (`createUserMessage()` in the harness does the same with `brandString(uuid)`).
 *
 * Keep this module dependency-free so it can be unit-tested without a Harness.
 */
import { randomUUID } from "node:crypto";
import type { DshMessageSource } from "./types.js";

/** A complete, persisted-safe `user/message` payload for `agent/pre-step`. */
export interface DshInjectedUserMessage {
  /** DSH `MessageBase.id` — required by the session restore validator. */
  id: string;
  role: "user";
  content: Array<{ type: "text"; text: string }>;
  source: DshMessageSource;
}

/**
 * Build one injectable user message with a fresh stable identity.
 *
 * @param text - model-visible text of the injected context.
 * @param source - provenance tag persisted with the event; `kind` must be a
 *   non-empty string (DSH keeps unknown kinds for forward compatibility).
 */
export function createInjectedUserMessage(
  text: string,
  source: DshMessageSource,
): DshInjectedUserMessage {
  return {
    id: randomUUID(),
    role: "user",
    content: [{ type: "text", text }],
    source,
  };
}
