import { FxStore, RootReducer } from "./state/rootStore";

declare global {
  interface Window {
    fx: FxStore<RootReducer>;
  }
}
