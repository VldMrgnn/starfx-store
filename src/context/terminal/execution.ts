import { sleep } from "starfx";
import { put } from "starfx/store";

import { ensureArray } from "@app/service";
import {
  parseConsoleCmd,
  similoAddSome,
  similoMergeSome,
  similoPatchSome,
  similoRemoveSome,
  similoSetSome,
} from "@app/state";

import {
  terminalEmitterChannel,
  terminalReaderChannel,
} from "../../state/channel";
import { systemCommand, userCommand } from "./commands";

import type { Terminal } from "react-console-emulator";
import type { Operation, Subscription } from "effection";

export const dispatchSystemCmd = (
  terminal: Terminal,
  subscription: Subscription<any, any>,
) =>
  function* (): Operation<void> {
    if (!terminal) {
      console.log("there is no terminal");
      return;
    }
    while (true) {
      const message = yield* subscription.next();
      // if is an internal command
      if (terminal[message.value?.command]) {
        const params = ensureArray(message.value?.params || []);
        params.length
          ? terminal[message.value?.command](...params)
          : terminal[message.value?.command]();

        terminal.processCommand();
        continue;
      }
      // if is custom starfx | sys command
      if (["@fx", "@sys"].some((s) => message.value?.command.startsWith(s))) {
        systemCommand(terminal, message.value?.command, message.value?.params);
        continue;
      }
      // if is a configured input command (simulate user input)
      if (
        userCommand[message.value?.command] ||
        ["help", "clear"].includes(message.value?.command)
      ) {
        terminal.terminalInput.current.value =
          message.value?.command +
          " " +
          (message.value?.params || []).join(" ");
        terminal.processCommand();
        continue;
      }
    }
  };

export const dispatchTerminalCmd = (
  subscription: Subscription<any, Iterator<any, any>>,
) =>
  function* (): Operation<void> {
    const message = yield* subscription.next();
    switch (message.value?.command || "") {
      case "teststarfx":
        yield* parseConsoleCmd.run(
          parseConsoleCmd(message.value as { command: string; params: any[] }),
        );
        break;
      case "testconsole":
        yield* terminalReaderChannel.input.send({
          command: "echo",
          params: ["this is a console test..."],
        });
        yield* sleep(100);
        yield* terminalReaderChannel.input.send({
          command: "@sys.writelines",
          params: [
            `find some symbols at  https://github.com/sindresorhus/figures`,
          ],
        });
        break;

      case "similo":
        {
          const params = ensureArray(message.value?.params || []);
          switch (params[0]) {
            case "set":
              yield* put(similoSetSome());
              break;
            case "add":
              yield* put(similoAddSome(params[1]));
              break;
            case "remove":
              yield* put(similoRemoveSome(params[1]));
              break;
            case "patch":
              yield* put(similoPatchSome(params[1]));
              break;
            case "merge":
              yield* put(similoMergeSome(params[1]));
              break;
            default:
              break;
          }
        }
        break;
      default:
        break;
    }
  };

export function* consumeTerminalEmitter(): Operation<void> {
  const subscription = yield* terminalEmitterChannel.output;
  while (true) {
    // act on terminal commands, dispatch actions, call apis etc
    yield* window.fx.run(dispatchTerminalCmd(subscription));
  }
}
