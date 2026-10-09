import { Right } from './create';
import type * as DKind from '../../kind';
export declare const resultKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/result", unknown>>;
type _Result<GenericInformation extends string = string, GenericValue extends unknown = unknown> = (Right<GenericInformation, GenericValue> & DKind.Kind<typeof resultKind>);
export interface Result<GenericInformation extends string = string, GenericValue extends unknown = unknown> extends _Result<GenericInformation, GenericValue> {
}
export declare function result<GenericInformation extends string, const GenericValue extends unknown = undefined>(information: GenericInformation): (value: GenericValue) => Result<GenericInformation, GenericValue>;
export declare function result<GenericInformation extends string, const GenericValue extends unknown = undefined>(information: GenericInformation, value: GenericValue): Result<GenericInformation, GenericValue>;
export {};
