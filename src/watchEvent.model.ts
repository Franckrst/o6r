import {DeltaModel} from "./tools/delta";
import {WatchEventEnum} from "./watch.type";

export class WatchEventModel<T = any> {
    constructor(
        public type : WatchEventEnum,
        public ressource : T,
        public delta ?: DeltaModel[]) {
    }
}
