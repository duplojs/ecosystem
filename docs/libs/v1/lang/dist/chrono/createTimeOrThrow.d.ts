import { SerializedTheTime, SpoolingTime } from './types';
import { TheTime } from './theTime';
import * as DCommon from '../common';
declare const CreateTheTimeError_base: abstract new (error: string) => DCommon.DuploJSError<"chrono-create-the-time-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-chrono-create-the-time-error", unknown>>, unknown>;
export declare class CreateTheTimeError extends CreateTheTimeError_base {
    input: TheTime | number | SpoolingTime | SerializedTheTime;
    constructor(input: TheTime | number | SpoolingTime | SerializedTheTime);
}
export declare function createTimeOrThrow(input: number | TheTime | SpoolingTime | SerializedTheTime): TheTime;
export {};
