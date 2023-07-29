import { parallel, createQueryState } from "starfx";
import { configureStore } from "starfx/store";
import { api, thunks } from "./apis";
import * as slx from "./slices";
import { startupSaga } from "./rootSaga";
import { starduxTakeEvery } from "./stardux";
import { consumeTerminalEmitter } from "./channel";

import type { FxStore } from "starfx/store";
import type { QueryState } from "starfx";

export const initialState = createQueryState({
  [slx.appRepo.name]: slx.appRepo.initialState,
  [slx.notifyRepo.name]: { message: "" },
  [slx.similo.name]: slx.similo.initialState,
  [slx.usersRepo.name]: slx.usersRepo.initialState,
});

export const store = await configureStore({
  initialState,
});

type TInitialStore = typeof initialState;

export const fx = (window.fx = store);
export const runState = async () =>
  fx.run(function* () {
    const engine = yield* parallel([
      function* () {
        yield* startupSaga();
        yield* starduxTakeEvery();
      },
      api.bootup,
      thunks.bootup,
      consumeTerminalEmitter,
    ]);
    yield* engine;
  });

export type RootState = TInitialStore & FxStore<TInitialStore>;
