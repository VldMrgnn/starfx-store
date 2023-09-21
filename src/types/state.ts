import type { PipeCtx, LoaderCtx, ActionWithPayload } from "starfx";

export interface AppState {
  [key: string]: any;
}
export interface Action<T extends string = string> {
  type: T;
}

export interface ThunkCtx<P = any, D = any> extends PipeCtx<P>, LoaderCtx<P> {
  actions: ActionWithPayload<P>[];
  json: D | null;
}

export type TApp = {
  winUser: string;
  thisPath: string;
  term_visible: boolean;
  term_history: string[];
  stateViewer: boolean;
  sidebarid: number;
};

export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};
