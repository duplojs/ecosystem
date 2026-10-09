import { Route } from '../route';
import { Hub } from '.';
import { RouterParams } from '../router';
import { HttpServerParams } from '../types';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
export declare const hookServerExitKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/server-hook-exit", unknown>>;
export interface ServerHookExit extends DKind.Kind<typeof hookServerExitKind> {
}
export declare const hookServerNextKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/server-hook-next", unknown>>;
export interface ServerHookNext extends DKind.Kind<typeof hookServerNextKind> {
}
export type HookBeforeBuildRoute = (route: Route) => DCommon.MaybePromise<Route>;
export declare function launchHookBeforeBuildRoute(hooks: Iterable<HookBeforeBuildRoute>, route: Route): Promise<Route<import('../route').RouteDefinition>>;
export type HookBeforeServerBuildRoutes = (hub: Hub, httpServerParams: HttpServerParams) => DCommon.MaybePromise<Hub | DCommon.EscapeVoid>;
export type HookBeforeStartServer = (hub: Hub, httpServerParams: HttpServerParams) => DCommon.MaybePromise<Hub | DCommon.EscapeVoid>;
export type HookAfterStartServer = (hub: Hub, httpServerParams: HttpServerParams) => DCommon.MaybePromise<Hub | DCommon.EscapeVoid>;
export declare function launchHookServer(hooks: Iterable<HookBeforeStartServer | HookAfterStartServer | HookBeforeServerBuildRoutes>, hub: Hub, httpServerParams: HttpServerParams): Promise<void>;
export interface HttpServerErrorParams {
    readonly error: unknown;
    next(): ServerHookNext;
    exit(): ServerHookExit;
    routerInitializationData: RouterParams;
}
export type HookServerError = (httpServerErrorParams: HttpServerErrorParams) => DCommon.MaybePromise<ServerHookExit | ServerHookNext>;
export declare function serverErrorExitHookFunction(): DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/server-hook-exit", unknown>>, null>;
export declare function serverErrorNextHookFunction(): DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/server-hook-next", unknown>>, null>;
export declare function launchHookServerError(hooks: readonly HookServerError[], params: HttpServerErrorParams): Promise<void>;
export interface HookHubLifeCycle {
    beforeBuildRoute?: HookBeforeBuildRoute;
    beforeStartServer?: HookBeforeStartServer;
    afterStartServer?: HookAfterStartServer;
    beforeServerBuildRoutes?: HookBeforeServerBuildRoutes;
    serverError?: HookServerError;
}
export declare function createHookHubLifeCycle(hookHubLifeCycle: HookHubLifeCycle): HookHubLifeCycle;
