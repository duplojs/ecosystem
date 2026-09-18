import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import { buildStepFunction, type createStepFunctionBuilder } from "../steps";
import { type RouteFunctionBuilderParams, type BuildRouteNotSupportEither, type createRouteFunctionBuilder } from "./create";
import { type HookRouteLifeCycle, type Route } from "@core/route";
import { type ResponseContract } from "@core/response";
import { type Environment } from "@core/types";

export interface BuildRouteFunctionParams {
	readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
	readonly environment: Environment;
	readonly defaultExtractContract: ResponseContract.Contract;
}

export function buildRouteFunction(
	route: Route,
	params: BuildRouteFunctionParams,
) {
	const functionParams: RouteFunctionBuilderParams = {
		success(value) {
			return DEither.right("buildSuccess", value);
		},
		buildStep(step) {
			return buildStepFunction(step, params);
		},
		environment: params.environment,
		globalHooksRouteLifeCycle: params.globalHooksRouteLifeCycle,
		defaultExtractContract: params.defaultExtractContract,
	};

	return DGenerator.asyncReduce(
		params.routeFunctionBuilders,
		DGenerator.reduceFrom<BuildRouteNotSupportEither>(DEither.left("routeNotSupport", route)),
		async({
			item: functionBuilder,
			lastValue,
			next,
			exit,
		}) => {
			const result = await functionBuilder(route, functionParams);

			if (DEither.isLeft(result)) {
				if (DEither.unwrapLeft(result) !== route) {
					return exit(result);
				}
				return next(lastValue);
			}

			return exit(result);
		},
	);
}
