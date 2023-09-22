import { parallel } from "starfx";
import { configureStore, take } from "starfx/store";

import { setupDevTool, subscribeToActions } from "../context/devtools";
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

export const runState = async () => {
  setupDevTool(fx, { name: "starfx" });
  return fx.run(function* () {
    const engine = yield* parallel([
      function* () {
        yield* startupSaga();
      },
      api.bootup,
      thunks.bootup,
      consumeTerminalEmitter,
      function* logger() {
        while (true) {
          const action = yield* take("*");
          subscribeToActions(fx, { action });
        }
      },
    ]);
    yield* engine;
  });
};

export type RootState = typeof schema.initialState;
