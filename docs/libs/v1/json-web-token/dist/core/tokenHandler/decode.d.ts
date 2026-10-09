import { TokenHandlerConfig } from './index';
import { DecodeTokenContent } from './shared';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
interface CreateTokenHandlerDecodeMethodParams {
    readonly config: TokenHandlerConfig;
    readonly decodeTokenContent: DecodeTokenContent;
}
export declare function createTokenHandlerDecodeMethod(params: CreateTokenHandlerDecodeMethodParams): (token: string, params?: {
    cipher?: object;
}) => Promise<DEither.Right<"token-decoded", {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
}> | DEither.Left<"token-format"> | DEither.Left<"header-json-error"> | DEither.Left<"header-decode-error", DDataStructure.Error | DDataStructure.ErrorPromise> | DEither.Left<"payload-json-error"> | DEither.Left<"payload-decode-error", DDataStructure.Error | DDataStructure.ErrorPromise>>;
export {};
