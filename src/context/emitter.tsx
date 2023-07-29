import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100000);
export default eventEmitter;
