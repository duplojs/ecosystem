import { Left } from './create';
import { GetValue } from '../types';
import type * as DCommon from '../../common';
export declare function whenIsLeft<const GenericInput extends unknown, const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid>(theFunction: (eitherValue: GetValue<Extract<DCommon.BreakGenericLink<GenericInput>, Left>>) => GenericOutput): (input: GenericInput) => (Exclude<DCommon.BreakGenericLink<GenericInput>, Left> | GenericOutput);
export declare function whenIsLeft<const GenericInput extends unknown, const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid>(input: GenericInput, theFunction: (eitherValue: GetValue<Extract<DCommon.BreakGenericLink<GenericInput>, Left>>) => GenericOutput): (Exclude<GenericInput, Left> | GenericOutput);
