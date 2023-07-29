/* eslint-disable no-inner-declarations */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "starfx/react";
import { TerminalProvider } from "./context";
import { store, runState } from "./state/rootStore";
import App from "./App";
import { StarfxStateViewer } from "./components";

import "devextreme/dist/css/dx.light.css";
import "allotment/dist/style.css";
import "./index.css";

runState();
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <TerminalProvider>
      <App />
      <StarfxStateViewer />
    </TerminalProvider>
  </Provider>,
  // </React.StrictMode>,
);
