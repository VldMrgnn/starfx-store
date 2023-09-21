import { createChannel } from "starfx";

import eventEmitter from "@app/context/emitter";

import type { Operation } from "starfx";

// prettier-ignore
export const terminalEmitterChannel = createChannel<
  { command: string; params: any[] },
  any
>();

// prettier-ignore
export const terminalReaderChannel = createChannel<
  { command: string; params: any[] },
  any
>();

export const inputTerminalCmd = (command: string, params: any[]) => {
  terminalEmitterChannel.input.send({ command, params });
};

const processEmmiter = (data: {
  command: string;
  params: string[];
  sym: symbol;
}) => {
  window.fx.run(function* (): Operation<void | string> {
    yield* terminalReaderChannel.input.send({
      command: data.command,
      params: data.params,
    });
  });
};
eventEmitter.on("event_terminal", processEmmiter);
