import { informationKind, valueKind } from '../kind';
import type * as DKind from '../../kind';
export declare const rightKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/right", unknown>>;
type _Right<GenericInformation extends string = string, GenericValue extends unknown = unknown> = (DKind.Kind<typeof rightKind> & DKind.Kind<typeof informationKind, GenericInformation> & DKind.Kind<typeof valueKind, GenericValue>);
export interface Right<GenericInformation extends string = string, GenericValue extends unknown = unknown> extends _Right<GenericInformation, GenericValue> {
}
export declare function right<GenericInformation extends string>(information: GenericInformation): Right<GenericInformation, undefined>;
export declare function right<GenericInformation extends string, const GenericValue extends unknown>(information: GenericInformation, value: GenericValue): Right<GenericInformation, GenericValue>;
export {};
