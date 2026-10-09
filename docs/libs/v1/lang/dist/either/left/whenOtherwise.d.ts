import { Right } from '../right';
import { Left } from './create';
import { GetValue } from '../types';
import type * as DCommon from '../../common';
type Either = Right | Left;
export declare function whenIsLeftOtherwise<const GenericInput extends unknown, const GenericOutput1 extends DCommon.AnyValue | DCommon.EscapeVoid, const GenericOutput2 extends DCommon.AnyValue | DCommon.EscapeVoid>(theFunction: (value: GetValue<Extract<DCommon.BreakGenericLink<GenericInput>, Left>>) => GenericOutput1, otherwiseFunction: (value: (Extract<DCommon.BreakGenericLink<GenericInput>, Right> | Exclude<GenericInput, Either>)) => GenericOutput2): (input: GenericInput) => (DCommon.BreakGenericLink<GenericOutput1> | DCommon.BreakGenericLink<GenericOutput2>);
export declare function whenIsLeftOtherwise<const GenericInput extends unknown, const GenericOutput1 extends DCommon.AnyValue | DCommon.EscapeVoid, const GenericOutput2 extends DCommon.AnyValue | DCommon.EscapeVoid>(input: GenericInput, theFunction: (value: GetValue<Extract<DCommon.BreakGenericLink<GenericInput>, Left>>) => GenericOutput1, otherwiseFunction: (value: (Extract<DCommon.BreakGenericLink<GenericInput>, Right> | Exclude<GenericInput, Either>)) => GenericOutput2): (DCommon.BreakGenericLink<GenericOutput1> | DCommon.BreakGenericLink<GenericOutput2>);
export {};
