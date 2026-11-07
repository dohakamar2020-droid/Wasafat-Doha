import { test } from "node:test";
import assert from "node:assert/strict";
import { scrollToLatestMessage } from "../lib/chat-scroll";

function container(messageHeight: number, currentScroll = 0) {
  return {
    scrollTop: currentScroll,
    clientHeight: 300,
    scrollHeight: 1100,
    getBoundingClientRect: () => ({ top: 100 }),
    lastElementChild: { getBoundingClientRect: () => ({ height: messageHeight, top: 350 }) },
  } as unknown as HTMLElement;
}

test("short new messages bring the conversation to the bottom", () => {
  const element = container(100);
  scrollToLatestMessage(element);
  assert.equal(element.scrollTop, 1100);
});

test("long new messages start at their beginning so the user can scroll through the answer", () => {
  const element = container(900, 100);
  scrollToLatestMessage(element);
  assert.equal(element.scrollTop, 336);
});

test("a hidden conversation or empty conversation is not scrolled", () => {
  const hidden = container(900, 100);
  Object.defineProperty(hidden, "clientHeight", { value: 0 });
  scrollToLatestMessage(hidden);
  assert.equal(hidden.scrollTop, 100);
  const empty = container(900, 100);
  Object.defineProperty(empty, "lastElementChild", { value: null });
  scrollToLatestMessage(empty);
  assert.equal(empty.scrollTop, 100);
});
