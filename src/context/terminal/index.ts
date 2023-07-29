import React, { useContext, useRef, createContext, useEffect } from "react";
import { fx } from "@app/state/rootStore";
import { call, go } from "starfx";
import {
  terminalReaderChannel,
  consumeTerminalReader,
} from "@app/state/channel";
import { userCommand } from "./commands";
import { put } from "starfx/store";
import { terminalApplyPersistence } from "@app/state";
import type { Terminal } from "react-console-emulator";

const TerminalContext = createContext(null);

export const TerminalProvider = ({ children }) => {
  const terminalRef = useRef<Terminal>(null);

  useEffect(() => {
    fx.run(consumeTerminalReader(terminalRef.current));
    fx.run(function* () {
      yield* go(() =>
        call(() => terminalApplyPersistence.run(terminalApplyPersistence())),
      );
    });
    if (terminalRef.current) {
      terminalRef.current.instance?.focus();
    }
  }, []);

  return /*#__PURE__*/ React.createElement(
    TerminalContext.Provider,
    {
      value: terminalRef,
    },
    children,
  );
};

export const syscmd = (command: string, params: any[]) => {
  fx.run(function* () {
    yield* terminalReaderChannel.input.send({ command, params });
  });
};
export const useTerminal = () => {
  const terminalRef = useContext(TerminalContext);
  // raw output to terminal
  const stdOut = (text: string) => terminalRef.current?.pushToStdout(text);
  // syscmd (from system to terminal)
  const syscmd = (command: string, params: any[]) => {
    fx.run(function* () {
      yield* terminalReaderChannel.input.send({ command, params });
    });
  };
  return {
    terminalRef,
    stdOut,
    syscmd,
    userCommand,
  };
};

export * from "./commands";
export * from "./execution";
