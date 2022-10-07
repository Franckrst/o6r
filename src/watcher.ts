import {KubeConfig} from "@kubernetes/client-node";
import * as k8s from "@kubernetes/client-node";
import {Logger, LogMeta} from "./logger";
import {Observable, Subject} from "rxjs";
import {DeltaModel} from "./tools/delta";
import {WatchEventModel} from "./watchEvent.model";
import {WatchEventEnum} from "./watch.type";

@LogMeta({
    prefix : (i:  Watcher) => `/apis/${i.groupe}/${i.version}/${i.kindPlural}`
})
export class Watcher {

    public obs: Observable<WatchEventModel>;
    private resources : Map<string,any> = new Map();
    private _subject: Subject<WatchEventModel> = new Subject()
    private _watchAPI: k8s.Watch;

    public constructor(private _kc: KubeConfig,public groupe: string,public version,public kindPlural: string) {
        Logger.info(`New Watcher for ${groupe}/${version}/${kindPlural}`);
        this.obs = this._subject.asObservable();
        this._watchAPI = new k8s.Watch(this._kc);
        this._run();
    }

    private _onEvent(phase: string, apiObj: any): void {
        Logger.info(`Received event in phase ${phase}.`);
        if (Object.keys(WatchEventEnum).includes(phase)) {
            this._subject.next(new WatchEventModel(
                phase as WatchEventEnum,
                apiObj,
                this.resources.has(apiObj['metadata']['uid']) ?
                this._getDelta(this.resources.get(apiObj['metadata']['uid']),apiObj) :
                []
            ));
            this.resources.set(apiObj['metadata']['uid'],apiObj);
        } else {
            Logger.error(`Unknown event in phase ${phase}.`);
        }
    }

    private _onDone(err: any) {
        Logger.info(`Connection closed. "${JSON.stringify(err)}"`);
        if(err?.statusCode === 404){
            return;
        }
        this._run();
    }

    private _run(): Promise<any> {
        Logger.info("Watching API");
        return this._watchAPI.watch(
            `/apis/${this.groupe}/${this.version}/${this.kindPlural}`,
            {},
            this._onEvent.bind(this),
            this._onDone.bind(this),
        );
    }

    private _getDelta(objA,objB): DeltaModel[]{
        const deltaSet = new Set([...Object.keys(objA),...Object.keys(objB)]);
        return [...deltaSet].reduce((acc,keyA)=>{
            const delta = new DeltaModel(keyA,objA[keyA],objB[keyA]);
            if(delta.hasDiff()){
                acc.push(delta);
            }
            return acc;
        },[]);
    }

}

