import { BuildedRoute, HookRouteLifeCycle, Route } from '../../route';
import { Environment, ExtractOtherwise } from '../../types';
import { BuildStepSuccessEither, BuildStepNotSupportEither } from '../steps';
import { Steps } from '../../steps';
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
export type BuildRouteSuccessEither = DEither.Right<"buildSuccess", BuildedRoute>;
export type BuildRouteNotSupportEither = DEither.Left<"routeNotSupport", Route>;
export interface RouteFunctionBuilderParams {
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly environment: Environment;
    buildStep(element: Steps): Promise<BuildStepSuccessEither | BuildStepNotSupportEither>;
    success(result: BuildedRoute): BuildRouteSuccessEither;
    readonly defaultExtractOtherwise: ExtractOtherwise;
}
export declare function createRouteFunctionBuilder(support: (route: Route) => boolean, builder: (route: Route, params: RouteFunctionBuilderParams) => DCommon.MaybePromise<BuildRouteSuccessEither | BuildStepNotSupportEither>): (route: Route, params: RouteFunctionBuilderParams) => DCommon.MaybePromise<BuildRouteNotSupportEither | BuildRouteSuccessEither | BuildStepNotSupportEither>;
