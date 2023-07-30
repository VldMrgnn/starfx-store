import { put, select, takeEvery, takeLatest, takeLeading } from "starfx/store";
import { call, sleep } from "starfx";
import localforage from "localforage";

import { fxCreateAssign, selectSlice } from "@app/state/stardux";
import { fx } from "@app/state/rootStore";
import { api, thunks } from "../apis";
import { terminalReaderChannel } from "../channel";
import { appNotify } from "./notify";
import { ensureArray, removeDuplicateNeighbors } from "@app/service";

import type { ApiCtx, Next } from "starfx";
import type { ThunkCtx } from "@app/types";
import type { RootState } from "../rootStore";

export type TApp = {
  winUser: string;
  thisPath: string;
  term_visible: boolean;
  term_history: string[];
  stateViewer: boolean;
  sidebarid: number;
};

const REPO_NAME = "app";
const initialState: TApp = {
  winUser: "",
  thisPath: "",
  term_visible: false,
  term_history: [],
  stateViewer: false,
  sidebarid: -1,
};

export const appRepo = fxCreateAssign({
  name: REPO_NAME,
  initialState,
});

// export const selectAppDefs = selectSlice(appRepo.name) as (s: RootState) => TApp;
export const selectAppDefs = (s: RootState) => s[REPO_NAME];

export const setAppValue = thunks.create<Partial<TApp>>(
  `setAppValue`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const currentState = yield* select((s) => s[REPO_NAME]);
    yield* put(appRepo.actions.set({ ...currentState, ...ctx.payload }));
    yield* next();
  },
);

export const loadUser = api.get(
  "/users/i",
  { supervisor: takeLatest },
  function* (ctx, next) {
    const u = Math.floor(Math.random() * 9) + 1;
    ctx.request = { method: "GET", url: `/users/${u}` };
    ctx.cache = false;
    yield* next();
    if (ctx.json.ok) {
      const { name: username } = ctx.json.data;
      // CALL OTHER THUNKS //
      yield* call(() => setAppValue.run(setAppValue({ winUser: username })));
    }
  },
);

export const loadUserWithError_ = api.get(
  "/users/7",
  { supervisor: takeLatest },
  function* (ctx: ApiCtx, next: Next) {
    const u = Math.floor(Math.random() * 9) + 1;
    ctx.request = { method: "GET", url: `/users/${u}` };
    // here we force an error to test the error handler //
    console.log('GENERATING AN ERROR');
    ctx.loader.meta = { key: ctx.payload.thisKeyDoesNotExist };
    console.log('NOT REACHED - but not throwing an error');
    ctx.cache = false;
    yield* next();
    if (ctx.json.ok) {
      const { name: username } = ctx.json.data;
      // CALL OTHER THUNKS //
      yield* call(() => setAppValue.run(setAppValue({ winUser: username })));
    }
  },
);

export const loadUserWithError = api.get(
  "/users/8",
  { supervisor: takeEvery },
  function* (ctx: ApiCtx, next: Next) {
    console.log('--0', ctx);
    ctx.loader.meta = { key: ctx.payload.thisKeyDoesNotExist };
    console.log('--1', ctx);
    throw new Error('GENERATING AN ERROR');
    yield* next();
    console.log('--2', ctx);
  },
);


export const loadPath = api.get(
  "/path",
  { supervisor: takeLatest }, 
  function* (ctx, next) {
    ctx.request = { method: "GET", url: `/comments/1` };
    ctx.loader.meta = { key: `/path` };
    ctx.cache = false;
    yield* sleep(1000);
    yield* next();
    if (ctx.json.ok) {
      const { name } = ctx.json.data;
      const path = name.split(" ").join("\\");
      const currentState = yield* select((s) => s[REPO_NAME]);

      // DISPATCH TO STORE //
      yield* put(
        appRepo.actions.set({ ...currentState, thisPath: `P:\\${path}` }),
      );
      yield* call(() =>
        appNotify.run(
          appNotify({
            type: "success",
            message: `path: P:\\${path}`,
            position: "top",
            duration: 2000,
          }),
        ),
      );
    }
  },
);

export const parseConsoleCmd = thunks.create<{
  command: string;
  params: any[];
}>(
  "thunks/parseConsoleCmd",
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const { command, params = [] } = ctx.payload;
    yield* call(() =>
      appNotify.run(
        appNotify({
          type: "success",
          message: `command: ${command} ${params.join(" ")}`,
          position: "top",
          duration: 4000,
        }),
      ),
    );
    yield* next();
  },
);

export const pushTermPersist = thunks.create<string>(
  `thunks/stashCopyAndForward`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const currentState = yield* select((s) => s[REPO_NAME]);
    const term_history = currentState.term_history;
    const new_term_history = [...term_history, ctx.payload].slice(-50);
    yield* put(
      appRepo.actions.set({ ...currentState, term_history: new_term_history }),
    );
    localforage.setItem("term_history", new_term_history);
    yield* next();
  },
);

export const terminalApplyPersistence = thunks.create(
  `thunks/terminalApplyPersistence`,
  { supervisor: takeLeading },
  function* (ctx: ThunkCtx, next: Next) {
    const loadHistory = function* () {
      const consoleHistory = yield* call(
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
      const currentState = yield* select((s) => s[REPO_NAME]);
      yield* put(
        appRepo.actions.set({
          ...currentState,
          term_history: dataWithoutDuplicates,
        }),
      );
    };
    fx.run(loadHistory);
    yield* next();
  },
);
