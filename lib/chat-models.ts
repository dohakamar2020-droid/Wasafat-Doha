/** Server-only orchestration. Credentials are supplied through server environment variables. */
export type ModelConfig = { geminiKey?: string; groqKey?: string; geminiModel?: string; groqModel?: string };
export type ModelResult = { text: string; provider: "gemini" | "groq" };
type Fetcher = typeof fetch;

export async function askModels(prompt: string, config: ModelConfig, fetcher: Fetcher = fetch): Promise<ModelResult | null> {
  if (config.geminiKey) {
    try {
      const model = config.geminiModel || "gemini-2.5-flash";
      if (!/^[a-zA-Z0-9._-]+$/.test(model)) throw new Error("invalid model");
      const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": config.geminiKey },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 1200 } }),
        signal: AbortSignal.timeout(12000), cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("").trim();
        if (typeof text === "string" && text) return { text: text.slice(0, 6000), provider: "gemini" };
      }
    } catch { /* Try the next provider; never log secrets or provider response bodies. */ }
  }
  if (config.groqKey) {
    try {
      const response = await fetcher("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.groqKey}` },
        body: JSON.stringify({ model: config.groqModel || "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 1200 }),
        signal: AbortSignal.timeout(12000), cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (typeof text === "string" && text.trim()) return { text: text.trim().slice(0, 6000), provider: "groq" };
      }
    } catch { /* Fall back to the local assistant. */ }
  }
  return null;
}
