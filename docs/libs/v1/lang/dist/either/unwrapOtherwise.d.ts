import { Left } from './left';
import { Right } from './right';
import { GetValue } from './types';
import type * as DCommon from '../common';
type Either = Right | Left;
export declare function unwrapOtherwise<GenericInput extends Either | DCommon.AnyValue, const GenericValue extends unknown>(input: GenericInput, value: () => GenericValue): (GetValue<Extract<GenericInput, Right>> | GenericValue);
export declare function unwrapOtherwise<GenericInput extends Either | DCommon.AnyValue, const GenericValue extends unknown>(value: () => GenericValue): (input: GenericInput) => (GetValue<Extract<GenericInput, Right>> | GenericValue);
export {};
