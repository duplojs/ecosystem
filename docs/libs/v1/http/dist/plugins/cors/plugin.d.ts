import { RequestMethods } from '../../core/request';
import { HubPlugin } from '../../core/hub';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
export interface CorsPluginParams {
    readonly allowOrigin?: (string | RegExp | DCommon.AnyTuple<string> | ((origin: string) => DCommon.MaybePromise<boolean>) | true);
    readonly allowHeaders?: string | DCommon.AnyTuple<string> | true;
    readonly exposeHeaders?: string | DCommon.AnyTuple<string>;
    readonly maxAge?: number;
    readonly credentials?: boolean;
    readonly allowMethods?: RequestMethods | DCommon.AnyTuple<RequestMethods> | true;
}
export declare function corsPlugin<GenericParams extends CorsPluginParams>(params: GenericParams & DObject.RequireAtLeastOne<GenericParams>): () => HubPlugin;
