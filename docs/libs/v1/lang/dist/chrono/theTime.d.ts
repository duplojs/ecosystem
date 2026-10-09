import { SerializedTheTime } from './types';
import * as DKind from '../kind';
declare const TheTime_base: new <GenericKindValue extends unknown = unknown, GenericParentInstance extends never = never>(kindValue: GenericKindValue) => import('..').NeverCoalescing<GenericParentInstance, {}> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangChrono/the-time", unknown>>, GenericKindValue>;
export declare class TheTime extends TheTime_base {
    private timeValue;
    private constructor();
    toNative(): number;
    toString(): SerializedTheTime;
    toJSON(): SerializedTheTime;
}
export {};
