import { Left } from './left';
import { Right } from './right';
import { informationKind } from './kind';
import { GetInformation, GetValue } from './types';
import type * as DCommon from '../common';
import * as DKind from '../kind';
import type * as DObject from '../object';
declare const HasNotSelectedInformationError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangEither/has-not-selected-information-error", unknown>>, ErrorConstructor>;
export declare class HasNotSelectedInformationError extends HasNotSelectedInformationError_base {
    value: unknown;
    selector: Record<string, boolean>;
    constructor(value: unknown, selector: Record<string, boolean>);
}
type Either = Right | Left;
type ForbiddenMoreKey<GenericInput extends unknown, GenericSelector extends Record<string, boolean>> = DObject.ForbiddenKey<GenericSelector, Extract<Exclude<keyof GenericSelector, GetInformation<Extract<GenericInput, Either>>>, string>>;
export declare function unwrapSelectionOrThrow<GenericInput extends Either | DCommon.AnyValue, const GenericSelector extends Record<GetInformation<Extract<GenericInput, Either>>, boolean>>(selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>): (input: GenericInput) => GetValue<Extract<GenericInput, Either & DKind.Kind<typeof informationKind, Extract<DObject.GetPropsWithValue<GenericSelector, true> | DObject.GetPropsWithValue<GenericSelector, boolean>, string>>>>;
export declare function unwrapSelectionOrThrow<GenericInput extends Either | DCommon.AnyValue, const GenericSelector extends Record<GetInformation<Extract<GenericInput, Either>>, boolean>>(input: GenericInput, selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>): GetValue<Extract<GenericInput, Either & DKind.Kind<typeof informationKind, Extract<DObject.GetPropsWithValue<GenericSelector, true> | DObject.GetPropsWithValue<GenericSelector, boolean>, string>>>>;
export {};
