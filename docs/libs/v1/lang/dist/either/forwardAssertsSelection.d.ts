import { Left } from './left';
import { Right } from './right';
import { informationKind } from './kind';
import type * as DCommon from '../common';
import * as DKind from '../kind';
import type * as DObject from '../object';
declare const ForwardAssertsSelectionError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangEither/forward-asserts-selection-error", unknown>>, ErrorConstructor>;
export declare class ForwardAssertsSelectionError extends ForwardAssertsSelectionError_base {
    value: unknown;
    selector: Record<string, boolean>;
    constructor(value: unknown, selector: Record<string, boolean>);
}
type Either = Right | Left;
type ForbiddenMoreKey<GenericInput extends unknown, GenericSelector extends Record<string, boolean>> = DObject.ForbiddenKey<GenericSelector, Extract<Exclude<keyof GenericSelector, DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>>, string>>;
type SelectedInput<GenericInput extends unknown, GenericSelector extends Record<string, boolean>> = (Extract<GenericInput, DKind.Kind<typeof informationKind, Extract<DObject.GetPropsWithValue<GenericSelector, true> | DObject.GetPropsWithValue<GenericSelector, boolean>, string>>> | Exclude<GenericInput, Either>);
export declare function forwardAssertsSelection<GenericInput extends Either | DCommon.AnyValue, GenericSelector extends Record<DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>, boolean>>(selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>): (input: GenericInput) => Extract<SelectedInput<GenericInput, GenericSelector>, any>;
export declare function forwardAssertsSelection<GenericInput extends Either | DCommon.AnyValue, const GenericSelector extends Record<DKind.GetValue<typeof informationKind, Extract<GenericInput, Either>>, boolean>>(input: GenericInput, selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>): Extract<SelectedInput<GenericInput, GenericSelector>, any>;
export {};
