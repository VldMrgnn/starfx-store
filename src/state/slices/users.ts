import { put, takeLatest } from "starfx/store";
import { fxCreateTable } from "../stardux";
import { api, thunks } from "../apis";

import type { ApiCtx, Next } from "starfx";
import { RootState } from "../rootStore";

const REPO_NAME = "users";

export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const initialState: Record<TUser["id"], TUser> = {};

export const usersRepo = fxCreateTable({
  name: REPO_NAME,
  initialState,
});

export const selectUsers = (s: RootState) => s[REPO_NAME];
export const selectUserList = (s: RootState) => Object.values(s[REPO_NAME]);

export const loadUserTable = api.get(
  "/users",
  { supervisor: takeLatest },
  function* (ctx, next) {
    ctx.request = { method: "GET", url: `/users` };
    ctx.loader.meta = { key: `/users` };
    ctx.cache = false;
    yield* next();
    if (ctx.json.ok) {
      const { data } = ctx.json;
      const data1 = data.map((d) => ({ id: d.id, name: d.name }));
      console.log("data1", data1);
      const umap = data1.reduce((acc, crt) => {
        if (typeof crt.name !== "string") return acc;
        if (typeof crt.id !== "number") return acc;
        if (!crt.name) return acc;
        acc[crt.id] = { id: crt.id, name: crt.name };
        return acc;
      }, {});
      yield* put(usersRepo.actions.set(umap));
    }
  },
);
