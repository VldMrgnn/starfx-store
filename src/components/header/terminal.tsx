import React from "react";

import { useSelector } from "starfx/react";

import { selectAppDefs, setAppValue } from "../../state";
import { fx } from "../../state/rootStore";
import "./header-common.scss";

export function TerminalSwitch() {
  const { term_visible } = useSelector(selectAppDefs);
  return (
    <div className="whoami-user terminal-switch">
      <button
        className="terminal-switch__button terminal-switch__button--active"
        onClick={() => {
          fx.dispatch(
            setAppValue({ key: "term_visible", value: !term_visible }),
          );
        }}
      >
        {term_visible ? (
          <i className="dx-icon dx-icon-panelleft" />
        ) : (
          <i className="dx-icon dx-icon-panelright" />
        )}
      </button>
    </div>
  );
}
