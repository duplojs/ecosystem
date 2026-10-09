import { patternResultKind } from './kind';
import { PatternResult } from './result';
import type * as DCommon from '../common';
import type * as DKind from '../kind';
export declare function otherwise<GenericInput extends DCommon.AnyValue, GenericInputValue extends Exclude<GenericInput, PatternResult>, GenericInputPatternResult extends Extract<GenericInput, PatternResult>, GenericOutput extends DCommon.AnyValue>(theFunction: (rest: GenericInputValue) => GenericOutput): (input: GenericInput | GenericInputPatternResult | GenericInputValue) => (GenericOutput | DKind.GetValue<typeof patternResultKind, GenericInputPatternResult>);
export declare function otherwise<GenericInput extends DCommon.AnyValue, GenericInputValue extends Exclude<GenericInput, PatternResult>, GenericInputPatternResult extends Extract<GenericInput, PatternResult>, GenericOutput extends DCommon.AnyValue>(input: GenericInput | GenericInputPatternResult | GenericInputValue, theFunction: (rest: GenericInputValue) => GenericOutput): (GenericOutput | DKind.GetValue<typeof patternResultKind, GenericInputPatternResult>);
