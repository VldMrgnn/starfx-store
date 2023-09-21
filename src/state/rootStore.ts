import { parallel } from "starfx";
import { configureStore } from "starfx/store";

import { consumeTerminalEmitter } from "../context/terminal";
import { startupSaga } from "./rootSaga";
import { api, schema, thunks } from "./rootSchema";

export const store = await configureStore({
  initialState: schema.initialState,
  // enable when needed:
  middleware: [
    function* logger(ctx, next) {
      yield* next();
      const userData = {
        type: `db::${(ctx.patches?.[0]?.path || []).join(" / ")}`,
        payload: ctx?.patches?.[0]?.value,
      };
      console.log("logger", userData);
    },
  ],
});

export const fx = (window.fx = store);
export const runState = async () =>
  fx.run(function* () {
    const engine = yield* parallel([
      function* () {
        yield* startupSaga();
      },
      api.bootup,
      thunks.bootup,
      consumeTerminalEmitter,
    ]);
    yield* engine;
  });

export type RootState = typeof schema.initialState;
