import { patternValueMaybeAllKind } from '../../kind';
import { PatternValueMaybeAll } from '..';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export type ComplexUnMatchedMaybeAll<GenericInput extends unknown, GenericPatternValue extends unknown> = Extract<GenericPatternValue, PatternValueMaybeAll> extends infer InferredPatternValue extends PatternValueMaybeAll ? DCommon.IsEqual<InferredPatternValue, never> extends true ? never : Extract<DKind.GetValue<typeof patternValueMaybeAllKind, InferredPatternValue>, GenericInput> : never;
