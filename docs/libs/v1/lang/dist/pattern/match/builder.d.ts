import { ComplexMatchedValue, ComplexUnMatchedValue, Pattern, PatternValue } from '../types';
import * as DCommon from '../../common';
export interface BuilderMatcher {
    isMatch(value: unknown): boolean;
    theFunction(value: unknown): unknown;
}
export interface MatchBuilderDefinition {
    input: unknown;
    matchers: BuilderMatcher[];
}
export interface MatchBuilder<GenericValue extends unknown = never, GenericResult extends unknown = never> extends DCommon.Builder<MatchBuilderDefinition> {
    with<const GenericPattern extends Pattern<GenericValue>, GenericOutput extends unknown>(pattern: DCommon.FixDeepFunctionInfer<Pattern<GenericValue>, GenericPattern>, theFunction: (value: ComplexMatchedValue<GenericValue, PatternValue<GenericPattern>>) => GenericOutput): MatchBuilder<ComplexUnMatchedValue<GenericValue, PatternValue<GenericPattern>>, GenericOutput | GenericResult>;
    when<GenericPredicatedInput extends GenericValue, GenericOutput extends unknown>(predicate: (input: GenericValue) => input is GenericPredicatedInput, theFunction: (predicatedInput: GenericPredicatedInput) => GenericOutput): MatchBuilder<Exclude<GenericValue, GenericPredicatedInput>, GenericOutput | GenericResult>;
    when<GenericOutput extends unknown>(predicate: (input: GenericValue) => boolean, theFunction: (predicatedInput: GenericValue) => GenericOutput): MatchBuilder<GenericValue, GenericOutput | GenericResult>;
    whenNot<GenericPredicatedInput extends GenericValue, GenericOutput extends unknown>(predicate: (input: GenericValue) => input is GenericPredicatedInput, theFunction: (predicatedInput: Exclude<GenericValue, GenericPredicatedInput>) => GenericOutput): MatchBuilder<Extract<GenericValue, GenericPredicatedInput>, GenericOutput | GenericResult>;
    whenNot<GenericOutput extends unknown>(predicate: (input: GenericValue) => boolean, theFunction: (predicatedInput: GenericValue) => GenericOutput): MatchBuilder<GenericValue, GenericOutput | GenericResult>;
    exhaustive: DCommon.IsEqual<GenericValue, never> extends true ? () => GenericResult : (DCommon.ComputedTypeError<"Pattern are not exhaustive."> & {
        restValue: GenericValue;
    });
    otherwise<GenericOtherwiseResult extends unknown>(theFunction: (value: GenericValue) => GenericOtherwiseResult): GenericResult | GenericOtherwiseResult;
}
declare const InvalidExhaustivePatternError_base: abstract new (error: string) => DCommon.DuploJSError<"pattern-invalid-exhaustive-pattern-error", string> & import('../../kind').Kind<import('../../kind').Handler<import('../../kind').Definition<"@DuplojsLangCommon/duplojs-error-pattern-invalid-exhaustive-pattern-error", unknown>>, unknown>;
export declare class InvalidExhaustivePatternError extends InvalidExhaustivePatternError_base {
    input: unknown;
    constructor(input: unknown);
}
export declare const matchBuilder: DCommon.BuilderHandler<MatchBuilder<unknown, unknown> & Pick<MatchBuilder<never, unknown>, "exhaustive">>;
export {};
