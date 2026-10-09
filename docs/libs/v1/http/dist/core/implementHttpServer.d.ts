import { Hub } from './hub';
import { RouterParams } from './router';
import { HttpServerParams } from './types';
import { HookRouteLifeCycle } from './route';
import * as DCommon from "@duplojs-v1/lang/common";
export interface GetInterfaceHooksParams {
    readonly hub: Hub;
    readonly httpServerParams: HttpServerParams;
}
export interface ImplementHttpServerParams {
    readonly hub: Hub;
    readonly httpServerParams: HttpServerParams;
    getInterfaceHooks(params: GetInterfaceHooksParams): DCommon.AnyTuple<HookRouteLifeCycle>;
}
export type ExecRouteSystem = (routerInitializationData: RouterParams, whenUncaughtError: (error: unknown, routerInitializationData: RouterParams) => DCommon.MaybePromise<void>) => Promise<void>;
export interface InitHttpServerParams {
    readonly execRouteSystem: ExecRouteSystem;
    readonly httpServerParams: HttpServerParams;
}
export declare function implementHttpServer<GenericServer extends unknown>(params: ImplementHttpServerParams, initHttpServer: (params: InitHttpServerParams) => DCommon.MaybePromise<GenericServer>): Promise<GenericServer>;
