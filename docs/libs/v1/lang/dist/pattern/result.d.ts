import { patternResultKind } from './kind';
import type * as DKind from '../kind';
export interface PatternResult<GenericValue extends unknown = any> extends DKind.Kind<typeof patternResultKind, GenericValue> {
}
export declare function result<const GenericValue extends unknown>(value: GenericValue): PatternResult<GenericValue>;
export declare const isResult: <GenericInput extends unknown>(input: GenericInput) => input is Extract<GenericInput, DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangPattern/result", unknown>>, unknown>>;
