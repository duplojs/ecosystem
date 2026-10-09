import type * as DKind from "@duplojs-v1/lang/kind";
import type * as DCommon from "@duplojs-v1/lang/common";
declare const cipherKind: DKind.Handler<DKind.Definition<"@DuplojsJsonWebToken/cipher", unknown>>;
export interface Cipher<GenericAlgorithm extends string = string> extends DKind.Kind<typeof cipherKind> {
    readonly algorithm: GenericAlgorithm;
    encrypt(element: string): DCommon.MaybePromise<string>;
    decrypt(element: string): DCommon.MaybePromise<string>;
}
export interface CreateCipher<GenericAlgorithm extends string, GenericParams extends unknown> {
    readonly algorithm: GenericAlgorithm;
    (params: NoInfer<GenericParams>): Cipher<GenericAlgorithm>;
}
export declare function factory<const GenericAlgorithm extends string, GenericMethodsParams extends unknown>(algorithm: GenericAlgorithm, methods: (params: GenericMethodsParams, algorithm: NoInfer<GenericAlgorithm>) => {
    encrypt(element: string): DCommon.MaybePromise<string>;
    decrypt(element: string): DCommon.MaybePromise<string>;
}): CreateCipher<GenericAlgorithm, GenericMethodsParams>;
export {};
