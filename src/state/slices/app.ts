import { call, sleep } from "starfx";
import { takeEvery, takeLatest, updateStore } from "starfx/store";

import { api, db, thunks } from "@app/state/rootSchema";

import { appNotify } from "./notify";

import type { ApiCtx, Next } from "starfx";
import type { ThunkCtx } from "@app/types";

// export const selectAppDefs = selectSlice(appRepo.name) as (s: RootState) => TApp;
export const selectAppDefs = db.app.select;

export const setAppValue = thunks.create<Record<string, unknown>>(
  `setAppValue`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    console.log("ctx.payload", ctx.payload);
    yield* updateStore(db.app.update(ctx.payload));
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
      yield* call(() =>
        setAppValue.run(setAppValue({ key: "winUser", value: username })),
      );
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
    console.log("GENERATING AN ERROR");
    ctx.loader.meta = { key: ctx.payload.thisKeyDoesNotExist };
    console.log("NOT REACHED - but not throwing an error");
    ctx.cache = false;
    yield* next();
    if (ctx.json.ok) {
      const { name: username } = ctx.json.data;
      // CALL OTHER THUNKS //
      yield* call(() =>
        setAppValue.run(setAppValue({ key: "winUser", value: username })),
      );
    }
  },
);

export const loadUserWithError = api.get(
  "/users/8",
  { supervisor: takeEvery },
  function* (ctx: ApiCtx, next: Next) {
    console.log("--0", ctx);
    ctx.loader.meta = { key: ctx.payload.thisKeyDoesNotExist };
    console.log("--1", ctx);
    throw new Error("GENERATING AN ERROR");
    yield* next();
    console.log("--2", ctx);
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
      yield* updateStore(
        db.app.update({ key: "thisPath", value: `P:\\${path}` }),
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
