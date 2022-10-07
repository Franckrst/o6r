import 'reflect-metadata';
import { createLogger, format, transports } from 'winston';

export const Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console()
    ],
});


export function LogMeta<T extends  new (...args: any) => any>(option: {prefix ?: (instance: InstanceType<T>)=>string}){
    return function (target: T) {
        Reflect.defineMetadata('logMetaData', option, target.prototype);
    };
}

function toto(){
    arguments.callee.caller

}
