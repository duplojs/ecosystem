import type * as DCommon from '../common';
import type * as DKind from '../kind';
export declare const signatureKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/signature", string>>;
export interface Signature<GenericName extends string = string> extends DKind.Kind<typeof signatureKind, GenericName> {
}
export type SignedFunction<GenericName extends string = string, GenericFunction extends DCommon.AnyFunction = DCommon.AnyFunction> = (Signature<GenericName> & GenericFunction);
export declare function signedFunction<GenericName extends string, GenericFunction extends DCommon.AnyFunction>(name: NoInfer<GenericName>, theFunction: NoInfer<GenericFunction>): SignedFunction<GenericName, GenericFunction>;
