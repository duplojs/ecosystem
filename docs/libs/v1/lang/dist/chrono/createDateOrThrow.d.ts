import { SerializedTheDate, SpoolingDate } from './types';
import { TheDate } from './theDate';
import * as DKind from '../kind';
declare const CreateTheDateError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangChrono/create-the-date-error", unknown>>, ErrorConstructor>;
export declare class CreateTheDateError extends CreateTheDateError_base {
    input: string | Date | number | SpoolingDate | TheDate;
    constructor(input: string | Date | number | SpoolingDate | TheDate);
}
export declare function createDateOrThrow<GenericInput extends TheDate | Date | number | SerializedTheDate>(input: GenericInput): TheDate;
export declare function createDateOrThrow<GenericInput extends SpoolingDate>(input: GenericInput): TheDate;
export {};
