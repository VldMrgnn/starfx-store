import React from "react";

import { useSelector } from "starfx/react";

import { selectAppDefs, setAppValue } from "../../state";
import { fx } from "../../state/rootStore";
import "./header-common.scss";

export function StateViewer() {
  const { stateViewer } = useSelector(selectAppDefs);
  return (
    <div className="whoami-user terminal-switch">
      <button
        className="terminal-switch__button terminal-switch__button--active"
        onClick={() => {
          if (!stateViewer) {
            fx.dispatch(setAppValue({ key: "stateViewer", value: true }));
          }
        }}
      >
        {stateViewer ? (
          <i className="dx-icon dx-icon-none" />
        ) : (
          <i className="dx-icon dx-icon-favorites" />
        )}
      </button>
    </div>
  );
}
