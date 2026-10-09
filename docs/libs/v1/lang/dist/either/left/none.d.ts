import { Left } from './create';
import type * as DKind from '../../kind';
import type * as DCommon from '../../common';
export declare const noneKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/none", unknown>>;
export interface None extends DCommon.Forward<DKind.Kind<typeof noneKind> & Left<"none", null>> {
}
export declare function none(): None;
