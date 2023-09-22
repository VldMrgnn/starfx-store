import React from "react";

import { Allotment } from "allotment";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { run } from "starfx";
import { useSelector } from "starfx/react";

import { useTerminal, useWindowDimensions } from "@app/context";
import * as appConst from "@app/state/constants";

import "./App.scss";
import { SideBar, StateViewer, TerminalSwitch, Whoami } from "./components";
import { MainPage } from "./pageMain";
import { ConsolePage } from "./pageTerminal";
import { selectAppDefs } from "./state";

const appStyle = {
  "--header-height": `${appConst.SIZES.headerHeight}px`,
  "--footer-height": `${appConst.SIZES.footerHeight}px`,
} as React.CSSProperties;

function App() {
  const { drawerHeight } = useWindowDimensions();
  const { runTerminal } = useTerminal();
  const apps = useSelector(selectAppDefs);
  const term_visible = apps["term_visible"];
  React.useEffect(() => {
    run(runTerminal);
    return () => {
      console.log("runTerminal:cleanup");
      //todo: cleanup
    };
  }, []);
  return (
    <div id="app" style={appStyle}>
      <div id="main-content">
        <div id="sideheader">TEST APP</div>
        <div id="header">
          <div className="header__before" />
          <div className="header__center" />
          <div className="header__after">
            <Whoami />
            <TerminalSwitch />
            <StateViewer />
          </div>
        </div>
        <div id="sidebar">
          <div style={{ height: drawerHeight }}>
            <SideBar />
          </div>
        </div>
        <div id="content">
          <Allotment snap>
            <MainPage />
            <Allotment.Pane visible={term_visible}>
              <ConsolePage />
            </Allotment.Pane>
          </Allotment>
        </div>
        <div id="footer">*</div>
      </div>
    </div>
  );
}

export default App;
