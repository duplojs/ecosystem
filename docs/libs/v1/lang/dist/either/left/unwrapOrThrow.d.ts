import { Left } from './create';
import { GetValue } from '../types';
import * as DCommon from '../../common';
declare const NotLeftError_base: abstract new (error: string) => DCommon.DuploJSError<"either-not-left-error", string> & import('../../kind').Kind<import('../../kind').Handler<import('../../kind').Definition<"@DuplojsLangCommon/duplojs-error-either-not-left-error", unknown>>, unknown>;
export declare class NotLeftError extends NotLeftError_base {
    value: unknown;
    constructor(value: unknown);
}
export declare function unwrapLeftOrThrow<GenericInput extends unknown>(input: GenericInput): GetValue<Extract<GenericInput, Left>>;
export {};
