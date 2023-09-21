import React, { createContext, useEffect, useRef } from "react";

import { call } from "starfx";

import { terminalReaderChannel } from "@app/state/channel";
import { terminalApplyPersistence } from "@app/state/slices/persist";

import { dispatchSystemCmd } from "./execution";

import type { Operation } from "starfx";
import type { Terminal } from "react-console-emulator";

export const TerminalContext = createContext(null);

export const TerminalProvider = ({ children }) => {
  const terminalRef = useRef<Terminal>(null);

  const consumeTerminalReader = (terminal: Terminal) =>
    function* contextChannel(): Operation<void> {
      const subscription = yield* terminalReaderChannel.output;
      while (true) {
        // intake actions from the system and act on terminal
        yield* window.fx.run(dispatchSystemCmd(terminal, subscription));
      }
    };

  useEffect(() => {
    window.fx.run(function* () {
      yield* call(() =>
        terminalApplyPersistence.run(terminalApplyPersistence()),
      );
    });
    if (terminalRef.current) {
      terminalRef.current.instance?.focus();
    }
  }, []);

  return /*#__PURE__*/ React.createElement(
    TerminalContext.Provider,
    {
      value: { terminalRef, consumeTerminalReader: consumeTerminalReader },
    },
    children,
  );
};
