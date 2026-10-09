import { Left } from './left';
import { Right } from './right';
import { informationKind } from './kind';
import { GetInformation, GetValue } from './types';
import * as DKind from '../kind';
import type * as DCommon from '../common';
declare const HasNotInformationError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangEither/has-not-information-error", unknown>>, ErrorConstructor>;
export declare class HasNotInformationError extends HasNotInformationError_base {
    value: unknown;
    information: DCommon.MaybeArray<string>;
    constructor(value: unknown, information: DCommon.MaybeArray<string>);
}
type Either = Right | Left;
export declare function unwrapByInformationOrThrow<GenericInput extends Either | DCommon.AnyValue, const GenericInformation extends (GenericInput extends Either ? GetInformation<GenericInput> : never)>(information: GenericInformation | GenericInformation[]): (input: GenericInput) => GetValue<Extract<GenericInput, Either & DKind.Kind<typeof informationKind, GenericInformation>>>;
export declare function unwrapByInformationOrThrow<GenericInput extends Either | DCommon.AnyValue, GenericInformation extends (GenericInput extends Either ? GetInformation<GenericInput> : never)>(input: GenericInput, information: GenericInformation | GenericInformation[]): GetValue<Extract<GenericInput, Either & DKind.Kind<typeof informationKind, GenericInformation>>>;
export {};
