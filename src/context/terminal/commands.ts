import { run } from "effection";
import { spawn } from "starfx";
import { put } from "starfx/store";

import { ensureArray } from "@app/service";
import {
  terminalEmitterChannel,
  terminalReaderChannel,
} from "@app/state/channel";
import { pushTermPersist } from "@app/state/slices/persist";

import type { Operation } from "effection";
import type { Terminal } from "react-console-emulator";

export const systemCommand = (
  terminal: Terminal,
  command: string,
  params: any[],
) => {
  const cmd = command.replace("@fx.", "").replace("@sys.", "");
  switch (cmd) {
    case "writelines": {
      const lines = ensureArray(params);
      lines.forEach((line) => terminal.pushToStdout(line));
      break;
    }
    case "push-persisted": {
      terminal.state.history.push(...params);
      break;
    }
    default:
      return null;
  }
};

const userCommand_ = {
  cls: {
    description: "Clears the terminal screen.",
    fn: () =>
      run(function* (): Operation<void> {
        yield* terminalReaderChannel.input.send({
          command: "clear",
          params: [],
        });
      }),
  },
  similo: {
    description: `Trigger events to simulate different scenarios.    
    Usage examples:
        <span style="color:#dad">$ similo set</span> - sets implicit values
        <span style="color:#dad">$ similo add {"x":99}</span>
        <span style="color:#dad">$ similo remove i</span>
        <span style="color:#dad">$ similo patch {"x":100}</span>
        <span style="color:#dad">$ similo merge</span> - merges implicit values
        Then inspect the values in the store;
        <br/>
    `,
    fn: (...args) =>
      run(function* (): Operation<void | string> {
        switch (args?.[0]) {
          case "set":
            {
              yield* terminalEmitterChannel.input.send({
                command: "similo",
                params: ["set"],
              });
            }
            break;
          case "add":
            {
              yield* terminalEmitterChannel.input.send({
                command: "similo",
                params: ["add", args?.[1]],
              });
            }
            break;
          case "remove":
            {
              yield* terminalEmitterChannel.input.send({
                command: "similo",
                params: ["remove", args?.[1]],
              });
            }
            break;
          case "patch":
            {
              yield* terminalEmitterChannel.input.send({
                command: "similo",
                params: ["patch", args?.[1]],
              });
            }
            break;
          case "merge":
            {
              yield* terminalEmitterChannel.input.send({
                command: "similo",
                params: ["merge", args?.[1]],
              });
            }
            break;
          default:
            yield* terminalEmitterChannel.input.send({
              command: "similo",
              params: ["set"],
            });
        }
      }),
  },
  test: {
    description: `Tersting functionalities.
    Usage examples:
    <span style="color:#c386ff">$ test starfx</span>
    <span style="color:#c386ff">$ test console</span> <br/>
    `,
    fn: (...args) =>
      run(function* (): Operation<void | string> {
        switch (args?.[0]) {
          case "starfx":
            yield* terminalEmitterChannel.input.send({
              command: "teststarfx",
              params: ["we cand dispach actions from here"],
            });
            break;
          case "console":
            yield* terminalEmitterChannel.input.send({
              command: "testconsole",
              params: [],
            });
            break;
          case "loading":
            yield* terminalEmitterChannel.input.send({
              command: "loading",
              params: [],
            });
            break;
          default:
            return `<span>there is no test for <span style="color:#fa8072">${
              args?.[0] || "all commands"
            }</span></span> <br/>
            try one of these: <br/>
            <span style="color:#c386ff">test starfx</span> <br/>
            <span style="color:#c386ff">test console</span> <br/>
            `;
        }
      }),
  },
};
// HOC FOR SAVE HISTORY //
function fnx(name: string, fn: any) {
  return async (...args: any) => {
    const result = await fn(...args);
    if (args[0] === "login") return result;
    window.fx.run(function* (): Operation<void> {
      yield* spawn(function* () {
        yield* put(pushTermPersist([name, ...args].join(" ")));
      });
    });
    return result;
  };
}

const withHistory = (uc: any) => {
  return Object.entries(uc).reduce((acc, [key, value]: [string, any]) => {
    const value2 = Object.assign({}, value, { fn: fnx(key, value.fn) });
    acc[key] = value2;
    return acc;
  }, {});
};

export const userCommand = withHistory(userCommand_);

export default {
  systemCommand,
  userCommand,
};
