import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
export type TokenHeaderContent = {
    typ: "JWT";
    alg: string;
} & Record<string, unknown>;
export interface TokenPayloadContent {
    [key: string]: unknown;
    iss?: string;
    sub?: string;
    aud?: string | readonly string[];
    exp: number;
    iat: number;
}
interface CreateDecodeTokenContentParams {
    readonly headerStructure: DDataStructure.Structure<TokenHeaderContent>;
    readonly payloadStructure: DDataStructure.Structure<TokenPayloadContent>;
}
export type DecodeTokenContentResult = ({
    header: TokenHeaderContent;
    payload: TokenPayloadContent;
} | DEither.Left<"token-format"> | DEither.Left<"header-json-error"> | DEither.Left<"header-decode-error", DDataStructure.Error | DDataStructure.ErrorPromise> | DEither.Left<"payload-json-error"> | DEither.Left<"payload-decode-error", DDataStructure.Error | DDataStructure.ErrorPromise>);
export type DecodeTokenContent = (encodedHeader: string | undefined, encodedPayload: string | undefined) => DecodeTokenContentResult;
export declare function createDecodeTokenContent(params: CreateDecodeTokenContentParams): DecodeTokenContent;
export {};
