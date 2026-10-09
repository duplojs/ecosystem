import { Right } from './create';
import { GetValue } from '../types';
import type * as DCommon from '../../common';
export declare function whenIsRight<const GenericInput extends unknown, const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid>(theFunction: (eitherValue: GetValue<Extract<DCommon.BreakGenericLink<GenericInput>, Right>>) => GenericOutput): (input: GenericInput) => (Exclude<DCommon.BreakGenericLink<GenericInput>, Right> | GenericOutput);
export declare function whenIsRight<const GenericInput extends unknown, const GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid>(input: GenericInput, theFunction: (eitherValue: GetValue<Extract<DCommon.BreakGenericLink<GenericInput>, Right>>) => GenericOutput): (Exclude<GenericInput, Right> | GenericOutput);
