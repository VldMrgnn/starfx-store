import { createChannel } from "effection";
import { fx } from "@app/state/rootStore";
import { dispatchSystemCmd, dispatchTerminalCmd } from "@app/context";
import eventEmitter from "@app/context/emitter";
import type { Operation } from "starfx";
import type { Terminal } from "react-console-emulator";

// prettier-ignore
export const terminalEmitterChannel = createChannel<{ command: string; params: any[] }, any>();

// prettier-ignore
export const terminalReaderChannel = createChannel<{ command: string; params: any[] }, any>();

export const inputTerminalCmd = (command: string, params: any[]) => {
  terminalEmitterChannel.input.send({ command, params });
};
export function* consumeTerminalEmitter(): Operation<void> {
  const subscription = yield* terminalEmitterChannel.output;
  while (true) {
    // act on terminal commands, dispatch actions, call apis etc
    yield* fx.run(dispatchTerminalCmd(subscription));
  }
}

export const consumeTerminalReader = (terminal: Terminal) =>
  function* contextChannel(): Operation<void> {
    const subscription = yield* terminalReaderChannel.output;
    while (true) {
      // intake actions from the system and act on terminal
      yield* fx.run(dispatchSystemCmd(terminal, subscription));
    }
  };

const processEmmiter = (data: {
  command: string;
  params: string[];
  sym: symbol;
}) => {
  fx.run(function* (): Operation<void | string> {
    yield* terminalReaderChannel.input.send({
      command: data.command,
      params: data.params,
    });
  });
};
eventEmitter.on("event_terminal", processEmmiter);
