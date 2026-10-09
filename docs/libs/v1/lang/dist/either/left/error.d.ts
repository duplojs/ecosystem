import { Left } from './create';
import type * as DKind from '../../kind';
export declare const errorKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/error", unknown>>;
type _Error<GenericValue extends unknown = unknown> = (Left<"error", GenericValue> & DKind.Kind<typeof errorKind>);
export interface Error<GenericValue extends unknown = unknown> extends _Error<GenericValue> {
}
export declare function error<const GenericValue extends unknown>(value: GenericValue): Error<GenericValue>;
export {};
