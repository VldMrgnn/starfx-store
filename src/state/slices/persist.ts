import localforage from "localforage";
import { safe } from "starfx";
import { select, takeEvery, takeLeading, updateStore } from "starfx/store";

import { ensureArray, removeDuplicateNeighbors } from "@app/service";
import { db, thunks } from "@app/state/rootSchema";

import { terminalReaderChannel } from "../channel";

import type { Next } from "starfx";
import type { ThunkCtx } from "@app/types";

export const terminalApplyPersistence = thunks.create(
  `thunks/terminalApplyPersistence`,
  { supervisor: takeLeading },
  function* (ctx: ThunkCtx, next: Next) {
    const consoleHistory = yield* safe(
      async () => await localforage.getItem("term_history"),
    );
    const data = ensureArray(consoleHistory.ok ? consoleHistory.value : []);
    const dataWithoutDuplicates = removeDuplicateNeighbors(data);
    // this goes in the terminal's history
    yield* terminalReaderChannel.input.send({
      command: "@fx.push-persisted",
      params: dataWithoutDuplicates,
    });
    // this ensures continuity of the history in our state
    yield* updateStore(
      db.app.update({ key: "term_history", value: dataWithoutDuplicates }),
    );
    yield* next();
  },
);

export const pushTermPersist = thunks.create<string>(
  `thunks/stashCopyAndForward`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const currentState = yield* select(db.app.select);
    const term_history = currentState.term_history;
    const new_term_history = [...term_history, ctx.payload].slice(-50);
    yield* updateStore(
      db.app.update({ key: "term_history", value: new_term_history }),
    );
    localforage.setItem("term_history", new_term_history);
    yield* next();
  },
);
