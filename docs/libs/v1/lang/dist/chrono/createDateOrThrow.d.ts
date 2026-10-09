import { SerializedTheDate, SpoolingDate } from './types';
import { TheDate } from './theDate';
import * as DCommon from '../common';
declare const CreateTheDateError_base: abstract new (error: string) => DCommon.DuploJSError<"chrono-create-the-date-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-chrono-create-the-date-error", unknown>>, unknown>;
export declare class CreateTheDateError extends CreateTheDateError_base {
    input: string | Date | number | SpoolingDate | TheDate;
    constructor(input: string | Date | number | SpoolingDate | TheDate);
}
export declare function createDateOrThrow<GenericInput extends TheDate | Date | number | SerializedTheDate>(input: GenericInput): TheDate;
export declare function createDateOrThrow<GenericInput extends SpoolingDate>(input: GenericInput): TheDate;
export {};
