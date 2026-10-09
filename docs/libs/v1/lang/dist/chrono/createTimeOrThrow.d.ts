import { SerializedTheTime, SpoolingTime } from './types';
import { TheTime } from './theTime';
import * as DKind from '../kind';
declare const CreateTheTimeError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangChrono/create-the-time-error", unknown>>, ErrorConstructor>;
export declare class CreateTheTimeError extends CreateTheTimeError_base {
    input: TheTime | number | SpoolingTime | SerializedTheTime;
    constructor(input: TheTime | number | SpoolingTime | SerializedTheTime);
}
export declare function createTimeOrThrow(input: number | TheTime | SpoolingTime | SerializedTheTime): TheTime;
export {};
