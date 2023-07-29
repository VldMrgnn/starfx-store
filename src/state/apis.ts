import {
  createApi,
  fetcher,
  requestMonitor,
  createPipe,
  errorHandler,
  ApiCtx,
  Next,
} from "starfx";
import { storeMdw } from "starfx/store";
import { loadingMonitor } from "starfx/store";
import notify from "devextreme/ui/notify";
import type { ThunkCtx } from "../types";

export const thunks = createPipe<ThunkCtx | ApiCtx>();
thunks.use(errorHandler);
thunks.use(thunks.routes());

const errorfn = function (ctx: ApiCtx) {
  const { ok, status, statusText } = ctx.response;
  notify(
    {
      message: `${status} ${statusText} *(this is a test middleware)*`,
      width: 400,
      position: {
        at: "top",
        my: "top",
        of: "#root",
        offset: "0 22",
      },
    },
    "error",
    5000,
  );
  return "error";
};

export const api = createApi();
api.use(errorHandler);
api.use(requestMonitor());
api.use(storeMdw());
api.use(api.routes());
api.use(fetcher({ baseUrl: "https://jsonplaceholder.typicode.com" }));
