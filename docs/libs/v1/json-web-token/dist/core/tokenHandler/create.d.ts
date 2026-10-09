import { TokenHandlerConfig } from './index';
import { TokenHeaderContent, TokenPayloadContent } from './shared';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
interface CreateTokenHandlerCreateMethodParams {
    readonly config: TokenHandlerConfig;
    readonly headerStructure: DDataStructure.Structure<TokenHeaderContent>;
    readonly payloadStructure: DDataStructure.Structure<TokenPayloadContent>;
}
export declare function createTokenHandlerCreateMethod(params: CreateTokenHandlerCreateMethodParams): (payload: object, params?: {
    header?: object;
    signer?: object;
    cipher?: object;
}) => Promise<DEither.Right<"token-created", string> | DEither.Left<"header-encode-error", DDataStructure.Error | DDataStructure.ErrorPromise> | DEither.Left<"payload-encode-error", DDataStructure.Error | DDataStructure.ErrorPromise>>;
export {};
