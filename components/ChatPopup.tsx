"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import Chat from "@/app/chat/Chat";

/** Full-screen conversation, retaining its state when closed. */
export default function ChatPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const recipeSlug = pathname.match(/^\/recipes\/([^/]+)(?:\/|$)/)?.[1];

  function close() {
    setOpen(false);
  }
  function show() {
    setStarted(true);
    setOpen(true);
  }
  useEffect(() => {
    if (!open) {
      if (started) buttonRef.current?.focus();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "Tab" && panelRef.current) {
        const controls = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        )).filter(el => el.getClientRects().length > 0);
        if (!controls.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, started]);

  return <div className="chat-float">
    {started && <section id="chat-popup" ref={panelRef} className="chat-popup" role="dialog" aria-modal="true" aria-label="محادثة مساعد قمر" hidden={!open}>
      <div className="chat-popup-bar"><span>اسأل مساعد قمر</span><button ref={closeRef} type="button" onClick={close} aria-label="إغلاق المحادثة"><X size={21} aria-hidden="true" /></button></div>
      <Chat compact contextSlug={recipeSlug} />
    </section>}
    <button ref={buttonRef} type="button" className="chat-fab" hidden={open} onClick={show} aria-expanded={open} aria-controls={started ? "chat-popup" : undefined} aria-label="افتح مساعد قمر">
      <MessageCircle size={24} aria-hidden="true" />
      <span>اسأل قمر</span>
    </button>
  </div>;
}
