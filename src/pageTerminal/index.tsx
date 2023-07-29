import React, { useRef } from "react";
import Terminal from "react-console-emulator";
import { useTerminal } from "../context";
import config from "./config";

import "./page-terminal.scss";

export const ConsolePage = () => {
  const { terminalRef, userCommand } = useTerminal();
  const { globalStyles, casingCommands } = config;

  return (
    <div id={"builder-terminal"}>
      <Terminal
        ref={terminalRef}
        style={globalStyles}
        commands={userCommand}
        autoFocus
        dangerMode
        noEchoBack
        disableOnProcess
      />
    </div>
  );
};
