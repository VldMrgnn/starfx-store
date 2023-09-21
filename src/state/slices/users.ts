import { takeLatest, updateStore } from "starfx/store";

import { api, db } from "../rootSchema";

export const selectUsers = db.users.selectTable;
export const selectUserList = db.users.selectTableAsList;

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
      yield* updateStore(db.users.set(umap));
    }
  },
);
