import type * as DKind from "@duplojs-v1/lang/kind";
import type * as DCommon from "@duplojs-v1/lang/common";
declare const signerKind: DKind.Handler<DKind.Definition<"@DuplojsJsonWebToken/signer", unknown>>;
export interface Signer<GenericAlgorithm extends string = string> extends DKind.Kind<typeof signerKind> {
    readonly algorithm: GenericAlgorithm;
    sign(content: string): DCommon.MaybePromise<string>;
    verify(content: string, signature: string): DCommon.MaybePromise<boolean>;
}
export interface CreateSigner<GenericAlgorithm extends string, GenericParams extends unknown> {
    readonly algorithm: GenericAlgorithm;
    (params: NoInfer<GenericParams>): Signer<GenericAlgorithm>;
}
export declare function factory<const GenericAlgorithm extends string, GenericMethodsParams extends unknown>(algorithm: GenericAlgorithm, methods: (params: GenericMethodsParams, algorithm: NoInfer<GenericAlgorithm>) => {
    sign(content: string): DCommon.MaybePromise<string>;
    verify(content: string, signature: string): DCommon.MaybePromise<boolean>;
}): CreateSigner<GenericAlgorithm, GenericMethodsParams>;
export {};
