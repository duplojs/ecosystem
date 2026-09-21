import { buildRouteFunction, type BuildRouteFunctionParams, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, type Route, defaultExtractContract } from "@core";
import * as DEither from "@duplojs/lang/either";

export async function useTestRouteFunctionBuilder(
	route: Route,
	params: Partial<BuildRouteFunctionParams> = {},
) {
	const result = await buildRouteFunction(
		route,
		{
			environment: "DEV",
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultExtractStepFunctionBuilder,
				defaultHandlerStepFunctionBuilder,
				defaultProcessStepFunctionBuilder,
			],
			globalHooksRouteLifeCycle: [],
			defaultExtractContract,
			defaultCodecs: {},
			...params,
		},
	);

	if (DEither.isLeft(result)) {
		throw new Error("Route is not support.");
	}

	return DEither.unwrapRight(result);
}
