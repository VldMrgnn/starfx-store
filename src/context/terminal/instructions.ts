import { run, suspend } from "effection";
import eventEmitter from "@app/context/emitter";
import type { Operation } from "effection";

function writelines(text: string | string[]) {
  return run(function* (): Operation<void> {
    let output = [];
    if (Array.isArray(text)) {
      output = text;
    } else {
      if (typeof text === "string") {
        output = [text];
      } else {
        output = [JSON.stringify(text)];
      }
    }
    eventEmitter.emit("event_terminal", {
      command: "@sys.writelines",
      params: output,
    });
    yield* suspend();
  });
}
export const swsterm = {
  writelines,
};
