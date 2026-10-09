import { ComplexMatchedValue, Pattern, PatternValue } from './types';
import type * as DCommon from '../common';
export declare function isMatch<GenericInput extends DCommon.AnyValue, const GenericPattern extends Pattern<GenericInput>>(pattern: DCommon.FixDeepFunctionInfer<Pattern<GenericInput>, GenericPattern>): (input: GenericInput) => input is DCommon.ForcePredicate<GenericInput, ComplexMatchedValue<GenericInput, PatternValue<GenericPattern>>>;
export declare function isMatch<GenericInput extends DCommon.AnyValue, const GenericPattern extends Pattern<GenericInput>>(input: GenericInput, pattern: DCommon.FixDeepFunctionInfer<Pattern<GenericInput>, GenericPattern>): input is DCommon.ForcePredicate<GenericInput, ComplexMatchedValue<GenericInput, PatternValue<GenericPattern>>>;
