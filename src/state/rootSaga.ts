import { put } from "starfx/store";
import { call } from "starfx";

function* startUpLog() {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  console.log(
    `*** \u00A9 ${new Date().getFullYear()}| test application started @ ${formattedDate} ${formattedTime}`,
  );
  yield* put({ type: "INIT_STUFF" }); // not implemented //
}

export function* startupSaga() {
  yield* put({ type: "RESET_STORE" }); // not implemented //
  yield* call(() => startUpLog());
}
