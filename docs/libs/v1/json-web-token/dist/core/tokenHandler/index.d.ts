import { CreateSigner, Signer } from '../signer';
import { CreateCipher, Cipher } from '../cipher';
import { ExtractRequiredKeys, UnknownToUndefined } from '../types';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DChrono from "@duplojs-v1/lang/chrono";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DObject from "@duplojs-v1/lang/object";
import * as DKind from "@duplojs-v1/lang/kind";
declare const tokenHandlerConfigDataStructure: NoInfer<DDataStructure.ObjectStructure<{
    readonly maxAge: DChrono.TheTime;
    readonly issuer?: string | undefined;
    readonly audience?: string | readonly string[] | undefined;
    readonly subject?: string | undefined;
}, readonly []>>;
export type TokenHandlerConfig<GenericSignerAlgorithm extends string = string, GenericCipherAlgorithm extends string = string> = DCommon.SimplifyTopLevel<{
    now?(): DChrono.TheDate;
    signer: Signer<GenericSignerAlgorithm> | CreateSigner<GenericSignerAlgorithm, any>;
    cipher?: Cipher<GenericCipherAlgorithm> | CreateCipher<GenericCipherAlgorithm, any>;
} & DDataStructure.StructureValue<typeof tokenHandlerConfigDataStructure>>;
type SignerAlgorithm<GenericSignerAlgorithm extends Signer | CreateSigner<string, any>> = GenericSignerAlgorithm extends (...args: any[]) => {
    algorithm: infer InferredAlgorithm;
} ? InferredAlgorithm : GenericSignerAlgorithm extends {
    algorithm: infer InferredAlgorithm;
} ? InferredAlgorithm : never;
export type DefaultTokenHeaderKeys = "typ" | "alg";
export type DefaultTokenPayloadKeys = "iss" | "sub" | "aud" | "exp" | "iat";
export interface DecodeOutput<GenericTokenHandlerConfig extends TokenHandlerConfig, GenericCustomPayload extends Record<string, unknown>, GenericCustomHeader extends Record<string, unknown>> {
    readonly header: DCommon.SimplifyTopLevel<{
        readonly typ: "JWT";
        readonly alg: SignerAlgorithm<GenericTokenHandlerConfig["signer"]>;
    } & Readonly<GenericCustomHeader>>;
    readonly payload: DCommon.SimplifyTopLevel<{
        readonly iss: UnknownToUndefined<GenericTokenHandlerConfig["issuer"]>;
        readonly sub: UnknownToUndefined<GenericTokenHandlerConfig["subject"]>;
        readonly aud: UnknownToUndefined<GenericTokenHandlerConfig["audience"]>;
        readonly exp: number;
        readonly iat: number;
    } & Readonly<GenericCustomPayload>>;
}
type VerifyParams<GenericTokenHandlerConfig extends TokenHandlerConfig> = (GenericTokenHandlerConfig["signer"] extends (params: infer InferredSignerParams) => any ? {
    signer: InferredSignerParams;
} : {}) & (GenericTokenHandlerConfig["cipher"] extends (params: infer InferredCipherParams) => any ? {
    cipher: InferredCipherParams;
} : {}) & {
    tolerance?: DChrono.TheTime;
};
type CreateParams<GenericTokenHandlerConfig extends TokenHandlerConfig, GenericCustomHeader extends Record<string, unknown>> = (GenericTokenHandlerConfig["signer"] extends (params: infer InferredSignerParams) => any ? {
    signer: InferredSignerParams;
} : {}) & (GenericTokenHandlerConfig["cipher"] extends (params: infer InferredCipherParams) => any ? {
    cipher: InferredCipherParams;
} : {}) & (keyof GenericCustomHeader extends never ? {} : ExtractRequiredKeys<GenericCustomHeader> extends never ? {
    header?: GenericCustomHeader;
} : {
    header: GenericCustomHeader;
});
type DecodeParams<GenericTokenHandlerConfig extends TokenHandlerConfig> = (GenericTokenHandlerConfig["cipher"] extends (params: infer InferredCipherParams) => any ? {
    cipher: InferredCipherParams;
} : {});
type ComputeParams<GenericParams extends object> = keyof GenericParams extends never ? [] : ExtractRequiredKeys<GenericParams> extends never ? [params?: GenericParams] : [params: GenericParams];
declare const tokenHandlerKind: DKind.Handler<DKind.Definition<"@DuplojsJsonWebToken/token-handler", unknown>>;
export interface TokenHandler<GenericTokenHandlerConfig extends TokenHandlerConfig = TokenHandlerConfig, GenericCustomPayload extends Record<string, unknown> = {}, GenericCustomHeader extends Record<string, unknown> = {}> extends DKind.Kind<typeof tokenHandlerKind> {
    verify(token: string, ...args: ComputeParams<VerifyParams<GenericTokenHandlerConfig>>): Promise<DEither.Right<"token-verified", DCommon.SimplifyTopLevel<DecodeOutput<GenericTokenHandlerConfig, GenericCustomPayload, GenericCustomHeader>>> | DEither.Left<"token-format"> | DEither.Left<"header-json-error"> | DEither.Left<"header-decode-error", DDataStructure.Error> | DEither.Left<"payload-json-error"> | DEither.Left<"payload-decode-error", DDataStructure.Error> | DEither.Left<"signature-invalid"> | DEither.Left<"issue-invalid"> | DEither.Left<"subject-invalid"> | DEither.Left<"audience-invalid"> | DEither.Left<"expired">>;
    decode(token: string, ...args: ComputeParams<DecodeParams<GenericTokenHandlerConfig>>): Promise<DEither.Right<"token-decoded", DCommon.SimplifyTopLevel<DecodeOutput<GenericTokenHandlerConfig, GenericCustomPayload, GenericCustomHeader>>> | DEither.Left<"token-format"> | DEither.Left<"header-json-error"> | DEither.Left<"header-decode-error", DDataStructure.Error> | DEither.Left<"payload-json-error"> | DEither.Left<"payload-decode-error", DDataStructure.Error>>;
    create(payload: GenericCustomPayload, ...args: ComputeParams<CreateParams<GenericTokenHandlerConfig, GenericCustomHeader>>): Promise<DEither.Right<"token-created", string> | DEither.Left<"header-encode-error", DDataStructure.Error> | DEither.Left<"payload-encode-error", DDataStructure.Error>>;
    createOrThrow(payload: GenericCustomPayload, ...args: ComputeParams<CreateParams<GenericTokenHandlerConfig, GenericCustomHeader>>): Promise<string>;
}
declare const TokenHandlerWrongConfig_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsJsonWebToken/token-handler", unknown>>, ErrorConstructor>;
export declare class TokenHandlerWrongConfig extends TokenHandlerWrongConfig_base {
    constructor(_error: DEither.Left);
}
declare const TokenHandlerCreateError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsJsonWebToken/token-handler", unknown>>, ErrorConstructor>;
export declare class TokenHandlerCreateError extends TokenHandlerCreateError_base {
    constructor(error: DEither.Left);
}
export declare function createTokenHandler<GenericTokenHandlerConfig extends TokenHandlerConfig, GenericCustomPayload extends DDataStructure.ShapeObjectStructure, GenericCustomHeader extends DDataStructure.ShapeObjectStructure = {}>(params: (GenericTokenHandlerConfig & {
    readonly customPayloadShape: (GenericCustomPayload & DObject.ForbiddenKey<GenericCustomPayload, DefaultTokenPayloadKeys>);
    readonly customHeaderShape?: (GenericCustomHeader & DObject.ForbiddenKey<GenericCustomHeader, DefaultTokenHeaderKeys>);
})): TokenHandler<GenericTokenHandlerConfig, DDataStructure.ShapeObjectStructureValue<GenericCustomPayload>, DDataStructure.ShapeObjectStructureValue<GenericCustomHeader>>;
export {};
