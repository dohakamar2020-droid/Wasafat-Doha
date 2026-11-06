import { test } from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import ChatPopup from "../components/ChatPopup";

Object.assign(globalThis, { React });

test("global launcher renders on regular, recipe, cooking, watch and chat routes", () => {
  for (const path of ["/", "/discover", "/recipes/chicken-negrisco", "/recipes/chicken-negrisco/cook", "/watch", "/chat"]) {
    const html = renderToStaticMarkup(React.createElement(PathnameContext.Provider, { value: path }, React.createElement(ChatPopup)));
    assert.match(html, /aria-label="افتح مساعد قمر"/);
    assert.match(html, /aria-expanded="false"/);
    assert.match(html, /اسأل قمر/);
    assert.doesNotMatch(html, /role="dialog"/);
  }
});
