import { takeEvery, updateStore } from "starfx/store";

import { ensureArray } from "@app/service";

import { db, thunks } from "../rootSchema";

import type { Next } from "starfx";
import type { ThunkCtx } from "@app/types";

const similodata = [
  { a: 1 },
  { b: 2 },
  { c: 3 },
  { d: 4 },
  { e: 5 },
  { f: 6 },
  { g: 7 },
  { h: 8 },
  { i: 9 },
  { j: 10 },
];

const mergeWith = [
  { a: 1 },
  { b: 2 },
  { c: 3 },
  { d: 4 },
  { e: 5 },
  { f: 6 },
  { g: 7 },
  { h: 8 },
  { i: 9 },
  { j: 10 },
  { k: 11 },
  { l: 12 },
  { m: 13 },
  { n: 14 },
];
export const similoSetSome = thunks.create(
  `/thunks/similo/similoSetSome`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const smap = similodata.reduce((acc, cur) => {
      const key = Object.keys(cur)[0];
      acc[key] = cur[key];
      return acc;
    }, {});
    yield* updateStore(db.similo.set(smap));
    yield* next();
  },
);

function isJSONString(str) {
  try {
    const obj = JSON.parse(str);
    return typeof obj === "object" && obj !== null;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}
export const similoAddSome = thunks.create<unknown>(
  `/thunks/similo/similoAddSome`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    if (!isJSONString(ctx.payload as string)) {
      console.log(`similoAddSome: not a json string - try similo add {"x":99}`);
      yield* next();
      return;
    }
    const data = JSON.parse(ctx.payload as string);
    yield* updateStore(db.similo.add(data));
    yield* next();
  },
);

export const similoRemoveSome = thunks.create<unknown>(
  `/thunks/similo/similoRemoveSome`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const arr = ensureArray(ctx.payload);
    console.log("arr", arr);
    yield* updateStore(db.similo.remove(arr));
    yield* next();
  },
);

export const similoPatchSome = thunks.create<unknown>(
  `/thunks/similo/similoPatchSome`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    if (!isJSONString(ctx.payload as string)) {
      console.log(`similoAddSome: not a json string - try similo add {"x":99}`);
      yield* next();
      return;
    }
    const data = JSON.parse(ctx.payload as string);
    console.log("data", data);
    yield* updateStore(db.similo.patch(data));
    yield* next();
  },
);

export const similoMergeSome = thunks.create<unknown>(
  `/thunks/similo/similoMergeSome`,
  { supervisor: takeEvery },
  function* (ctx: ThunkCtx, next: Next) {
    const smap = mergeWith.reduce((acc, cur) => {
      const key = Object.keys(cur)[0];
      acc[key] = cur[key];
      return acc;
    }, {});
    yield* updateStore(db.similo.merge(smap));
    yield* next();
  },
);
