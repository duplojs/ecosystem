import { Left } from './create';
import type * as DKind from '../../kind';
export declare const failKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/fail", unknown>>;
type _Fail = (Left<"fail", void> & DKind.Kind<typeof failKind>);
export interface Fail extends _Fail {
}
export declare function fail(): Fail;
export {};
