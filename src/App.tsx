import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import React from "react";
import { Allotment } from "allotment";
import { useSelector } from "starfx/react";
import { selectAppDefs } from "./state";
import { Whoami } from "./components";
import { TerminalSwitch } from "./components";
import { StateViewer } from "./components";
import { MainPage } from "./pageMain";
import { SideBar } from "./components";
import { ConsolePage } from "./pageTerminal";
import * as appConst from "@app/state/constants";
import { useWindowDimensions } from "@app/context";

import "./App.scss";

const appStyle = {
  "--header-height": `${appConst.SIZES.headerHeight}px`,
  "--footer-height": `${appConst.SIZES.footerHeight}px`,
} as React.CSSProperties;

function App() {
  const { drawerHeight } = useWindowDimensions();
  const apps = useSelector(selectAppDefs);
  const term_visible = apps["term_visible"];
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
