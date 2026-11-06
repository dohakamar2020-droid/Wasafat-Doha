import { test } from "node:test";
import assert from "node:assert/strict";
import { askModels } from "../lib/chat-models";

test("orchestration prefers Gemini and keeps API key out of URL", async () => {
  const calls: string[] = [];
  const mock: typeof fetch = async (url, options) => {
    calls.push(String(url));
    assert.equal(new Headers(options?.headers).get("x-goog-api-key"), "test-gemini");
    assert.ok(!String(url).includes("test-gemini"));
    return Response.json({ candidates: [{ content: { parts: [{ text: "إجابة من المصدر" }] } }] });
  };
  const result = await askModels("test", { geminiKey: "test-gemini", groqKey: "test-groq" }, mock);
  assert.equal(result?.provider, "gemini");
  assert.equal(result?.text, "إجابة من المصدر");
  assert.equal(calls.length, 1);
});

test("falls back to Groq on provider failure, empty output or timeout", async () => {
  for (const first of ["error", "empty", "throw"]) {
    const calls: string[] = [];
    const mock: typeof fetch = async (url, options) => {
      calls.push(String(url));
      if (calls.length === 1) {
        if (first === "throw") throw new Error("timeout");
        return first === "error" ? new Response("error", { status: 503 }) : Response.json({ candidates: [] });
      }
      assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer test-groq");
      return Response.json({ choices: [{ message: { content: "نتيجة احتياطية" } }] });
    };
    const result = await askModels("test", { geminiKey: "test-gemini", groqKey: "test-groq" }, mock);
    assert.equal(result?.provider, "groq");
    assert.equal(calls.length, 2);
  }
});

test("uses a single configured provider or returns null when all providers fail", async () => {
  const mock: typeof fetch = async () => new Response(null, { status: 429 });
  assert.equal(await askModels("test", { geminiKey: "test", groqKey: "test" }, mock), null);
  assert.equal(await askModels("test", {}, mock), null);
  const groq: typeof fetch = async () => Response.json({ choices: [{ message: { content: "ok" } }] });
  assert.equal((await askModels("test", { groqKey: "test" }, groq))?.provider, "groq");
});
