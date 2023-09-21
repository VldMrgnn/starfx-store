import {
  createApi,
  createPipe,
  errorHandler,
  fetcher,
  requestMonitor,
} from "starfx";
import { configureStore, createSchema, slice, storeMdw } from "starfx/store";

import type { ThunkCtx, TApp, TUser } from "../types";

const app: TApp = {
  winUser: "",
  thisPath: "",
  term_visible: false,
  term_history: [],
  stateViewer: false,
  sidebarid: -1,
};
const similo = {
  init: { init: "init" },
};
const user: Record<TUser["id"], TUser> = {};

export const schema = createSchema({
  loaders: slice.loader(),
  data: slice.table({ empty: {} }),
  app: slice.obj(app),
  notify: slice.obj({ message: "" }),
  similo: slice.table({
    initialState: similo,
    empty: { init: "" },
  }),
  users: slice.table({
    initialState: user,
    empty: {
      id: -1,
      name: "",
      username: "",
      email: "",
    },
  }),
});

export const db = schema.db;
export const store = await configureStore({
  initialState: schema.initialState,
  // enable when needed:
  middleware: [
    function* logger(ctx, next) {
      yield* next();
      console.log("logger", ctx.name, ctx.payload);
    },
  ],
});

export const api = createApi();
api.use(errorHandler);
api.use(requestMonitor());
api.use(storeMdw(db));
api.use(api.routes());
api.use(fetcher({ baseUrl: "https://jsonplaceholder.typicode.com" }));

export const thunks = createPipe<ThunkCtx>();
thunks.use(errorHandler);
thunks.use(thunks.routes());
