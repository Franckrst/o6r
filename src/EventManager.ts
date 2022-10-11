import {filter, MonoTypeOperatorFunction, Subject, Subscription} from 'rxjs';
import {Logger} from "./logger";
import {WatchEventEnum} from "./watch.type";
import {WatchEventModel} from "./watchEvent.model";
import {Watcher} from "./watcher";
import {AnyFunction} from "tsdef";
import {O6r} from "./main";
import {DecoratorHandler, KindEventFunction} from "./event-handler.type";


export class EventMangager{

    private static watchers: Map<string,Watcher> = new Map();
    private static watchersSub: Map<AnyFunction,Subscription> = new Map();

    public static create(groupe: string, version: string, kindPlural: string){
        return function (target: object, propertyKey: string | Symbol, descriptor: TypedPropertyDescriptor<KindEventFunction>) {
            Logger.info(`Bind event create of ${groupe}/${version}/${kindPlural} on ${propertyKey}`);
            EventMangager._addListener(WatchEventEnum.ADDED, target[propertyKey.toString()].bind(target),groupe,version,kindPlural);
        };
    }
    public static remove(groupe: string, version: string, kindPlural: string){
        return function (target: object, propertyKey: string | Symbol, descriptor: TypedPropertyDescriptor<KindEventFunction>) {
            Logger.info(`Bind event remove of ${groupe}/${version}/${kindPlural} on ${propertyKey}`);
            EventMangager._addListener(WatchEventEnum.REMOVE,target[propertyKey.toString()].bind(target),groupe,version,kindPlural);
        };
    }
    public static update(groupe: string, version: string, kindPlural: string,deltaFilters?: string|string[]){
        return function (target: object, propertyKey: string | Symbol, descriptor: TypedPropertyDescriptor<KindEventFunction>) {
            Logger.info(`Bind event update of ${groupe}/${version}/${kindPlural} on ${propertyKey}`);
            EventMangager._addListener(WatchEventEnum.MODIFIED,target[propertyKey.toString()].bind(target),groupe,version,kindPlural,deltaFilters);
        };
    }


    private static _addListener(
        event:WatchEventEnum,
        fnc: KindEventFunction,
        groupe: string,
        version: string,
        kindPlural: string,
        deltaFilters ?:string | string[]){
        const watcherKey = `${groupe}/${version}/${kindPlural}`;
        if(!this.watchers.has(watcherKey)){
            this.watchers.set(watcherKey,new Watcher(O6r.kc,groupe,version,kindPlural));
        }
        this.watchersSub.set(fnc,this.watchers.get(watcherKey).obs
            .pipe(EventMangager._filterEvent(event,deltaFilters)
            )
            .subscribe(event => {
                try {
                    fnc(event, O6r.kc);
                }catch (e) {
                    Logger.error(e);
                }
            }));
    }

    private static _filterEvent(watchEvent: WatchEventEnum,deltaFilters: string | string[]): MonoTypeOperatorFunction<WatchEventModel>{
        return filter((data: WatchEventModel)=>{
            if(deltaFilters){
                let deltaFiltersArr: string[];
                if(deltaFilters instanceof Array){
                    deltaFiltersArr = deltaFilters;
                }else{
                    deltaFiltersArr = [deltaFilters]
                }
                if(!deltaFiltersArr.some(filter=>data.delta.some(delta=>delta.key === filter))){
                    return false;
                }
            }
            return data.type === watchEvent
        });
    }

}