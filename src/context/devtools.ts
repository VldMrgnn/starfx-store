import { AnyAction } from "redux";
import { FxStore } from "starfx/store";

import { AppState } from "@app/types";

import type {} from "@redux-devtools/extension";

type Config = Parameters<
  (Window extends { __REDUX_DEVTOOLS_EXTENSION__?: infer T }
    ? T
    : any)["connect"]
>[0];

type Options = {
  action?: any;
  enabled?: boolean;
  name?: string;
} & Config;

let devToolsInstance: any;

export function setupDevTool<T extends object>(fxstore: T, options?: Options) {
  const { enabled, name = "", ...rest } = options || {};

  let extension: (typeof window)["__REDUX_DEVTOOLS_EXTENSION__"] | false;
  try {
    extension =
      (enabled ?? import.meta.env?.MODE !== "production") &&
      window.__REDUX_DEVTOOLS_EXTENSION__;
  } catch {
    // nop  (extension is undefined)
  }
  if (!extension) {
    if (import.meta.env?.MODE !== "production" && enabled) {
      console.warn("[Warning] Please install/enable Redux devtools extension");
    }
    return;
  }

  // initialize the DevTools instance
  devToolsInstance = extension.connect({ name, ...rest });
  devToolsInstance.init(fxstore);

  // for later useq
  return devToolsInstance;
}

export function subscribeToActions(
  fxstore: FxStore<AppState>,
  options?: Options,
) {
  if (!devToolsInstance) {
    // not initialized
    return;
  }

  interface DevtoolsAction extends AnyAction {
    payload?: any;
  }

  const unSubscribe = (fxstore as FxStore<AppState>).subscribe(() => {
    console.log("Subscribing to actions");
    devToolsInstance.send(
      {
        type: "ACTION",
        ...(options?.action || {}),
      } as DevtoolsAction,
      (fxstore as FxStore<AppState>).getState(),
    );
  });

  // for later use
  return unSubscribe;
}
