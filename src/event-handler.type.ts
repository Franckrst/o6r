import {WatchEventModel} from "./watchEvent.model";
import * as k8s from "@kubernetes/client-node";
import {WatchEventEnum} from "./watch.type";

export type KindEventFunction = (watcherEvent?: WatchEventModel, kc?: k8s.KubeConfig)=> any;
export type KindEventCatchFunction = (e: Error, watcherEvent?: WatchEventModel, kc?: k8s.KubeConfig)=> any;
export type DecoratorHandler = (
    event: WatchEventEnum,
    fnc: KindEventFunction,
    groupe: string,
    version: string,
    kindPlural: string,
    deltaFilters ?: string| string[]
)=>void;
