import { useSelector } from "starfx/react";
import { fx } from "../../state/rootStore";
import { selectAppDefs, setAppValue } from "../../state";
import "./header-common.scss";

export function StateViewer() {
  const { stateViewer } = useSelector(selectAppDefs);
  return (
    <div className="whoami-user terminal-switch">
      <button
        className="terminal-switch__button terminal-switch__button--active"
        onClick={() => {
          if (!stateViewer) {
            fx.dispatch(setAppValue({ stateViewer: true }));
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
