"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import Chat from "@/app/chat/Chat";

/** Non-modal panel: the rest of the site remains usable while the chat is open. */
export default function ChatPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const recipeSlug = pathname.match(/^\/recipes\/([^/]+)(?:\/|$)/)?.[1];

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }
  function show() {
    setStarted(true);
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return <div className="chat-float">
    {started && <section id="chat-popup" className="chat-popup" role="dialog" aria-label="محادثة مساعد قمر" hidden={!open}>
      <div className="chat-popup-bar"><span>اسأل مساعد قمر</span><button ref={closeRef} type="button" onClick={close} aria-label="إغلاق المحادثة"><X size={21} aria-hidden="true" /></button></div>
      <Chat compact contextSlug={recipeSlug} />
    </section>}
    <button ref={buttonRef} type="button" className="chat-fab" onClick={open ? close : show} aria-expanded={open} aria-controls={started ? "chat-popup" : undefined} aria-label={open ? "إغلاق مساعد قمر" : "افتح مساعد قمر"}>
      {open ? <X size={22} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
      <span>اسأل قمر</span>
    </button>
  </div>;
}
