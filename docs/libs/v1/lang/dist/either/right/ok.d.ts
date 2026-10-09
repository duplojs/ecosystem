import { Right } from './create';
import type * as DKind from '../../kind';
export declare const okKind: DKind.Handler<DKind.Definition<"@DuplojsLangEither/ok", unknown>>;
type _Ok = (Right<"ok", void> & DKind.Kind<typeof okKind>);
export interface Ok extends _Ok {
}
export declare function ok(): Ok;
export {};
