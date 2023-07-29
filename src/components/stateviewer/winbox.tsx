import React from "react";
import { useSelector } from "starfx/react";
import WinBox from "react-winbox";
import LunaStateViewer from "./luna";
import { Switch, Case } from "react-context-switch";
import { setAppValue } from "../../state/slices/app";
import { fx } from "../../state/rootStore";
import { selectAppDefs } from "../../state/slices/app";
import { useWindowDimensions } from "@app/context";

import "winbox/dist/css/winbox.min.css";
import "./viewer.scss";

export const StarfxStateViewer = () => {
  const { height, width } = useWindowDimensions();
  const { stateViewer } = useSelector(selectAppDefs);
  const markClosed = () => {
    fx.dispatch(setAppValue({ stateViewer: false }));
  };
  return (
    <div id="state-viewer">
      <Switch value={stateViewer}>
        <Case when={true}>
          <WinBox
            id="statebox"
            title="Starfx Store"
            noFull
            width={width / 2}
            height={0.8 * height}
            x="center"
            y={0.1 * height}
            onClose={markClosed}
          >
            <LunaStateViewer />
          </WinBox>
        </Case>
      </Switch>
    </div>
  );
};
