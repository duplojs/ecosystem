import { Left } from './create';
import { GetValue } from '../types';
import * as DKind from '../../kind';
declare const NotLeftError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangEither/not-left-error", unknown>>, ErrorConstructor>;
export declare class NotLeftError extends NotLeftError_base {
    value: unknown;
    constructor(value: unknown);
}
export declare function unwrapLeftOrThrow<GenericInput extends unknown>(input: GenericInput): GetValue<Extract<GenericInput, Left>>;
export {};
