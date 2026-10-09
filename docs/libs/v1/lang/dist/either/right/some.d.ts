import { Right } from './create';
import type * as DKind from '../../kind';
import type * as DCommon from '../../common';
export declare const someKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/some", unknown>>;
export interface Some<GenericValue extends unknown> extends DCommon.Forward<DKind.Kind<typeof someKind> & Right<"some", GenericValue>> {
}
export declare function some<GenericValue extends unknown>(value: GenericValue): Some<GenericValue>;
