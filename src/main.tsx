/* eslint-disable no-inner-declarations */
import React from "react";
import ReactDOM from "react-dom/client";

import "allotment/dist/style.css";
import "devextreme/dist/css/dx.light.css";
import { Provider } from "starfx/react";

import App from "./App";
import { StarfxStateViewer } from "./components";
import { TerminalProvider } from "./context";
import "./index.css";
import { runState, store } from "./state/rootStore";

runState();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <TerminalProvider>
        <App />
        <StarfxStateViewer />
      </TerminalProvider>
    </Provider>
    ,
  </React.StrictMode>,
);
