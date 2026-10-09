import { Right } from './create';
import { GetValue } from '../types';
import * as DKind from '../../kind';
declare const NotRightError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangEither/not-right-error", unknown>>, ErrorConstructor>;
export declare class NotRightError extends NotRightError_base {
    value: unknown;
    constructor(value: unknown);
}
export declare function unwrapRightOrThrow<GenericInput extends unknown>(input: GenericInput): GetValue<Extract<GenericInput, Right>>;
export {};
