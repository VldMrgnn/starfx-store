import React from "react";
import { useSelector } from "starfx/react";
import { selectAppDefs } from "../../state";
import { useTerminal } from "@app/context";
import "./header-common.scss";

export const Whoami = () => {
  const { stdOut } = useTerminal();
  const { winUser = "" } = useSelector(selectAppDefs);
  return (
    <button
      className="whoami-user"
      onClick={() => {
        stdOut(winUser || "dev");
      }}
    >
      <div className="whoami-user__text">{winUser || "dev"}</div>
    </button>
  );
};
