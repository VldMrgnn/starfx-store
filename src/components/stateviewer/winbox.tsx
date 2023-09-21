import React from "react";

import { Case, Switch } from "react-context-switch";
import WinBox from "react-winbox";
import { useSelector } from "starfx/react";
import "winbox/dist/css/winbox.min.css";

import { useWindowDimensions } from "@app/context";

import { fx } from "../../state/rootStore";
import { selectAppDefs, setAppValue } from "../../state/slices/app";
import LunaStateViewer from "./luna";
import "./viewer.scss";

export const StarfxStateViewer = () => {
  const { height, width } = useWindowDimensions();
  const { stateViewer } = useSelector(selectAppDefs);
  const markClosed = () => {
    fx.dispatch(setAppValue({ key: "stateViewer", value: false }));
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
