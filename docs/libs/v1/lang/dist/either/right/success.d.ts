import { Right } from './create';
import type * as DKind from '../../kind';
export declare const successKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/success", unknown>>;
type _Success<GenericValue extends unknown = unknown> = (Right<"success", GenericValue> & DKind.Kind<typeof successKind>);
export interface Success<GenericValue extends unknown = unknown> extends _Success<GenericValue> {
}
export declare function success<const GenericValue extends unknown>(value: GenericValue): Success<GenericValue>;
export {};
