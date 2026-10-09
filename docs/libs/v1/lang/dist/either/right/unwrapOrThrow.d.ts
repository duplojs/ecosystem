import { Right } from './create';
import { GetValue } from '../types';
import * as DCommon from '../../common';
declare const NotRightError_base: abstract new (error: string) => DCommon.DuploJSError<"either-not-right-error", string> & import('../../kind').Kind<import('../../kind').Handler<import('../../kind').Definition<"@DuplojsLangCommon/duplojs-error-either-not-right-error", unknown>>, unknown>;
export declare class NotRightError extends NotRightError_base {
    value: unknown;
    constructor(value: unknown);
}
export declare function unwrapRightOrThrow<GenericInput extends unknown>(input: GenericInput): GetValue<Extract<GenericInput, Right>>;
export {};
