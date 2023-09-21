import { useContext } from "react";

import { userCommand } from "./commands";
import { TerminalContext } from "./provider";

export const useTerminal = () => {
  const { terminalRef, consumeTerminalReader } = useContext(TerminalContext);
  const runTerminal = () =>
    window.fx.run(consumeTerminalReader(terminalRef.current));
  // raw output to terminal
  const stdOut = (text: string) => terminalRef.current?.pushToStdout(text);
  return {
    terminalRef,
    stdOut,
    userCommand,
    runTerminal,
  };
};
