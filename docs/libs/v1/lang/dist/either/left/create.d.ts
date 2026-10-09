import { informationKind, valueKind } from '../kind';
import type * as DKind from '../../kind';
export declare const leftKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/left", unknown>>;
type _Left<GenericInformation extends string = string, GenericValue extends unknown = unknown> = (DKind.Kind<typeof leftKind> & DKind.Kind<typeof informationKind, GenericInformation> & DKind.Kind<typeof valueKind, GenericValue>);
export interface Left<GenericInformation extends string = string, GenericValue extends unknown = unknown> extends _Left<GenericInformation, GenericValue> {
}
export declare function left<GenericInformation extends string>(information: GenericInformation): Left<GenericInformation, undefined>;
export declare function left<GenericInformation extends string, const GenericValue extends unknown>(information: GenericInformation, value: GenericValue): Left<GenericInformation, GenericValue>;
export {};
