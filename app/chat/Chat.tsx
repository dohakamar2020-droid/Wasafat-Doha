"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ChefHat, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { useCatalog } from "@/components/CatalogProvider";
import { answerChat, type ChatAnswer } from "@/lib/chat-assistant";

type Message = { id: number; role: "user" | "assistant"; text: string; recipeSlugs?: string[]; recipeSlug?: string };
const starter = "أهلاً بيك في مطبخ قمر! اختار وصفة واسألني عن مقاديرها أو خطواتها، أو قولّي إيه الموجود عندك وهنشوف إيه اللي محتاج تراجعه.";
export default function Chat() {
  const catalog = useCatalog();
  const sp = useSearchParams();
  const recipeParam = sp.get("recipe");
  const [slug, setSlug] = useState(() => catalog.some(r => r.slug === recipeParam) ? recipeParam! : "");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: starter }]);
  const current = catalog.find(r => r.slug === slug);
  const [lastQuestion, setLastQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setSlug(catalog.some(r => r.slug === recipeParam) ? recipeParam! : ""); }, [recipeParam, catalog]);
  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages]);
  function reply(answer: ChatAnswer, userText?: string) {
    setMessages(old => [...old, ...(userText ? [{ id: old.length, role: "user" as const, text: userText }] : []), { id: old.length + (userText ? 1 : 0), role: "assistant" as const, ...answer }]);
    if (answer.recipeSlug) setSlug(answer.recipeSlug);
  }
  async function send(q: string, selected = slug, showUser = true) {
    const text = q.trim();
    if (!text || busy) return;
    setLastQuestion(text);
    if (showUser) setMessages(old => [...old, { id: old.length, role: "user", text }]);
    setInput("");
    setBusy(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ question: text, recipeSlug: selected || undefined, preferSelected: !showUser, history: messages.slice(-6).map(m => ({ role: m.role, text: m.text.slice(0, 1200) })) }),
      });
      if (!response.ok) {
        if (response.status === 429) { reply({ text: "طلبات كثيرة، حاول تاني بعد شوية." }); return; }
        throw new Error("unavailable");
      }
      const data = await response.json();
      reply({ text: data.text, recipeSlug: data.recipeSlug, recipeSlugs: data.recipeSlugs });
    } catch {
      if (!controller.signal.aborted) reply({ ...answerChat(text, catalog, selected, !showUser), text: `المساعد المتصل مش متاح دلوقتي؛ دي إجابة من بيانات الموقع المحلية:\n\n${answerChat(text, catalog, selected, !showUser).text}` });
    } finally { if (requestRef.current === controller) { requestRef.current = null; setBusy(false); } }
  }
  function choose(next: string) {
    setSlug(next);
    if (!next) return;
    const r = catalog.find(x => x.slug === next);
    if (!r) return;
    if (lastQuestion) void send(lastQuestion, next, false);
    else reply({ text: `تمام، اخترت «${r.title}». اسألني عن المقادير أو الخطوات أو اكتب الموجود عندك.`, recipeSlug: next });
  }
  function reset() { requestRef.current?.abort(); requestRef.current = null; setBusy(false); setMessages([{ id: 0, role: "assistant", text: starter }]); setSlug(""); setInput(""); setLastQuestion(""); }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); void send(input); }
  return <div className="wrap chat-page">
    <div className="chat-intro">
      <div><span className="eyebrow"><Sparkles size={15} aria-hidden="true" /> رفيقك في المطبخ</span><h1>اسأل مساعد قمر</h1><p>محتار في المقادير أو ناقصك حاجة؟ خلّينا نلاقي الإجابة من الوصفات الموجودة عندنا.</p></div>
      <div className="chat-intro-mark" aria-hidden="true"><ChefHat size={38} /><span>سؤال صغير،<br />طبخة أحلى.</span></div>
    </div>
    <div className="chat-layout">
      <section className="chat-window" aria-label="المحادثة">
        <div className="chat-window-head"><div className="chat-avatar"><MessageCircle size={20} aria-hidden="true" /></div><div><strong>مساعد قمر</strong><small>يعتمد على بيانات الوصفات المنشورة</small></div><button className="chat-reset" type="button" onClick={reset} aria-label="بدء محادثة جديدة"><RotateCcw size={17} aria-hidden="true" /> ابدأ من جديد</button></div>
        <div className="chat-context"><label htmlFor="chat-recipe">الوصفة اللي بنتكلم عنها</label><select id="chat-recipe" disabled={busy} value={slug} onChange={e => choose(e.target.value)}><option value="">اختار وصفة من المكتبة</option>{catalog.map(r => <option key={r.slug} value={r.slug}>{r.title}</option>)}</select>{current && <Link href={`/recipes/${current.slug}`}>افتح الوصفة ←</Link>}</div>
        <div className="chat-messages" ref={messagesRef} aria-live="polite" aria-relevant="additions text">
          {messages.map(m => <div className={`chat-message ${m.role}`} key={m.id}>{m.role === "assistant" && <div className="chat-bubble-avatar" aria-hidden="true"><Sparkles size={15} /></div>}<div className="chat-bubble"><span className="chat-sender">{m.role === "assistant" ? "مساعد قمر" : "أنت"}</span><p>{m.text}</p>{m.recipeSlug && <Link href={`/recipes/${m.recipeSlug}`} className="chat-source">افتح الوصفة والمصدر الأصلي ←</Link>}{m.recipeSlugs && <div className="chat-choices">{m.recipeSlugs.map(s => {const r = catalog.find(x => x.slug === s); return r ? <button type="button" disabled={busy} key={s} onClick={() => choose(s)}>{r.title} ←</button> : null;})}</div>}</div></div>)}
        </div>
        {busy && <p className="chat-wait" role="status">بفكر في إجابتك…</p>}
        <div className="chat-suggestions" aria-label="أسئلة مقترحة"><span>جرّب تسأل:</span>{["إيه المقادير؟", "إيه خطوات الوصفة؟", "عندي دجاج وبصل، إيه الناقص؟"].map(q => <button key={q} type="button" disabled={busy} onClick={() => void send(q)}>{q}</button>)}</div>
        <form className="chat-form" onSubmit={submit}><label className="chat-visually-hidden" htmlFor="chat-input">اكتب سؤالك</label><input id="chat-input" value={input} onChange={e => setInput(e.target.value)} maxLength={800} placeholder="اكتب سؤالك هنا..." autoComplete="off" /><button type="submit" disabled={busy || !input.trim()} aria-label="إرسال السؤال"><ArrowUp size={21} aria-hidden="true" /></button></form>
        <p className="chat-footnote">الإجابات مبنية على البيانات المكتوبة، وليست ضمانًا للحساسية أو بديلًا عن مراجعة المصدر.</p>
      </section>
      <aside className="chat-aside"><div className="chat-aside-icon"><Sparkles size={22} aria-hidden="true" /></div><h2>إزاي أقدر أساعدك؟</h2><p>خطوات بسيطة توصلك للمعلومة اللي بتدور عليها.</p><ol><li><b>اختار الوصفة</b><span>من القائمة، أو اكتب اسمها في سؤالك.</span></li><li><b>اسأل براحتك</b><span>عن المقادير، الخطوات، الوقت، أو المكوّن الناقص.</span></li><li><b>راجع المصدر</b><span>كل إجابة مرتبطة بصفحة الوصفة وصاحبها.</span></li></ol><div className="chat-note"><b>معلومة مهمة</b><p>المساعد يستعين ببيانات الوصفة المنشورة، وقد يستخدم جيميناي أو جروك إذا كانا متاحين. الإجابات ممكن تخطئ؛ راجع صفحة الوصفة والفيديو الأصلي. بعض الوصفات ترشيحات فيديو فقط.</p><p>قد يُرسل سؤالك وآخر رسائل المحادثة وبيانات الوصفة لخدمة ذكاء اصطناعي لمعالجة الإجابة. تجنّب كتابة بيانات شخصية أو صحية.</p></div></aside>
    </div>
  </div>;
}
