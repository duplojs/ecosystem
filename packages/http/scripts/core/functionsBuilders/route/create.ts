import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { type BuildedRoute, type HookRouteLifeCycle, type Route } from "@core/route";
import { type Environment } from "@core/types";
import { type BuildStepSuccessEither, type BuildStepNotSupportEither } from "../steps";
import { type Steps } from "@core/steps";
import { type ResponseContract } from "@core/response";

export type BuildRouteSuccessEither = DEither.Right<"buildSuccess", BuildedRoute>;

export type BuildRouteNotSupportEither = DEither.Left<"routeNotSupport", Route>;

export interface RouteFunctionBuilderParams {
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];

	readonly environment: Environment;

	buildStep(
		element: Steps
	): Promise<
			| BuildStepSuccessEither
			| BuildStepNotSupportEither
	>;

	success(
		result: BuildedRoute
	): BuildRouteSuccessEither;

	readonly defaultExtractContract: ResponseContract.Contract;
}

export function createRouteFunctionBuilder(
	support: (route: Route) => boolean,
	builder: (
		route: Route,
		params: RouteFunctionBuilderParams,
	) => DCommon.MaybePromise<
		| BuildRouteSuccessEither
		| BuildStepNotSupportEither
	>,
) {
	return (
		route: Route,
		params: RouteFunctionBuilderParams,
	): DCommon.MaybePromise<
		| BuildRouteNotSupportEither
		| BuildRouteSuccessEither
		| BuildStepNotSupportEither
	> => support(route)
		? builder(
			route,
			params,
		)
		: Promise.resolve(DEither.left("routeNotSupport", route));
}
