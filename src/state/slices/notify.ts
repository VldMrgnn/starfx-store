import { fxCreateAssign } from "../stardux";
import { thunks } from "../apis";
import notify from "devextreme/ui/notify";
import { IAppNotify } from "@app/types";

const REPO_NAME = "notify";

export const notifyRepo = fxCreateAssign({
  name: REPO_NAME,
  initialState: {
    message: "",
  },
});

export const appNotify = thunks.create<IAppNotify>(
  "notify",
  function* (ctx, next) {
    const { message, type, duration, position } = ctx.payload;
    notify(
      {
        message,
        width: 400,
        position: {
          at: position || "top",
          my: position || "top",
          of: "#root",
          offset: (position || "top") === "top" ? "0 22" : "0 -22",
        },
      },
      type,
      duration,
    );
    yield* next();
  },
);
