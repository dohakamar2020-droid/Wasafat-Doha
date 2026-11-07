/** Show the start of a message taller than the viewport; otherwise show its end. */
export function scrollToLatestMessage(container: HTMLElement): void {
  const last = container.lastElementChild as HTMLElement | null;
  if (!last || !container.clientHeight) return;
  if (last.getBoundingClientRect().height > container.clientHeight) {
    const top = last.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTop = Math.max(0, top - 14);
  } else {
    container.scrollTop = container.scrollHeight;
  }
}
