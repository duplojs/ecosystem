import { TokenHandlerConfig } from './index';
import { DecodeTokenContent } from './shared';
import type * as DChrono from "@duplojs-v1/lang/chrono";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
interface CreateTokenHandlerVerifyMethodParams {
    readonly config: TokenHandlerConfig;
    readonly decodeTokenContent: DecodeTokenContent;
}
export declare function createTokenHandlerVerifyMethod(params: CreateTokenHandlerVerifyMethodParams): (token: string, params?: {
    signer?: object;
    cipher?: object;
    tolerance?: DChrono.TheTime;
}) => Promise<DEither.Right<"token-verified", {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
}> | DEither.Left<"token-format"> | DEither.Left<"header-json-error"> | DEither.Left<"header-decode-error", DDataStructure.Error | DDataStructure.ErrorPromise> | DEither.Left<"payload-json-error"> | DEither.Left<"payload-decode-error", DDataStructure.Error | DDataStructure.ErrorPromise> | DEither.Left<"signature-invalid"> | DEither.Left<"issue-invalid"> | DEither.Left<"subject-invalid"> | DEither.Left<"audience-invalid"> | DEither.Left<"expired">>;
export {};
