import { BuildedRoute, HookRouteLifeCycle, Route } from '../../route';
import { Environment } from '../../types';
import { BuildStepSuccessEither, BuildStepNotSupportEither } from '../steps';
import { Steps } from '../../steps';
import { ResponseContract } from '../../response';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
export type BuildRouteSuccessEither = DEither.Right<"buildSuccess", BuildedRoute>;
export type BuildRouteNotSupportEither = DEither.Left<"routeNotSupport", Route>;
export interface RouteFunctionBuilderParams {
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly environment: Environment;
    buildStep(element: Steps): Promise<BuildStepSuccessEither | BuildStepNotSupportEither>;
    success(result: BuildedRoute): BuildRouteSuccessEither;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function createRouteFunctionBuilder(support: (route: Route) => boolean, builder: (route: Route, params: RouteFunctionBuilderParams) => DCommon.MaybePromise<BuildRouteSuccessEither | BuildStepNotSupportEither>): (route: Route, params: RouteFunctionBuilderParams) => DCommon.MaybePromise<BuildRouteNotSupportEither | BuildRouteSuccessEither | BuildStepNotSupportEither>;
