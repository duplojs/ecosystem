import { Left } from './left';
import { Right } from './right';
import { informationKind } from './kind';
import { GetInformation, GetValue } from './types';
import type * as DKind from '../kind';
import * as DCommon from '../common';
declare const HasNotInformationError_base: abstract new (error: string) => DCommon.DuploJSError<"either-has-not-information-error", string> & DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error-either-has-not-information-error", unknown>>, unknown>;
export declare class HasNotInformationError extends HasNotInformationError_base {
    value: unknown;
    information: DCommon.MaybeArray<string>;
    constructor(value: unknown, information: DCommon.MaybeArray<string>);
}
type Either = Right | Left;
export declare function unwrapByInformationOrThrow<GenericInput extends Either | DCommon.AnyValue, const GenericInformation extends (GenericInput extends Either ? GetInformation<GenericInput> : never)>(information: GenericInformation | GenericInformation[]): (input: GenericInput) => GetValue<Extract<GenericInput, Either & DKind.Kind<typeof informationKind, GenericInformation>>>;
export declare function unwrapByInformationOrThrow<GenericInput extends Either | DCommon.AnyValue, GenericInformation extends (GenericInput extends Either ? GetInformation<GenericInput> : never)>(input: GenericInput, information: GenericInformation | GenericInformation[]): GetValue<Extract<GenericInput, Either & DKind.Kind<typeof informationKind, GenericInformation>>>;
export {};
