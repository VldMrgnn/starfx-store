import { useSelector } from "starfx/react";
import { fx } from "../../state/rootStore";
import { selectAppDefs, setAppValue } from "../../state";
import "./header-common.scss";

export function TerminalSwitch() {
  const { term_visible } = useSelector(selectAppDefs);
  return (
    <div className="whoami-user terminal-switch">
      <button
        className="terminal-switch__button terminal-switch__button--active"
        onClick={() => {
          fx.dispatch(setAppValue({ term_visible: !term_visible }));
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
