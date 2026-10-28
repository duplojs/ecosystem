import { buildStepFunction, type BuildStepFunctionParams, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractOtherwise, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, type Steps } from "@core";
import * as DEither from "@duplojs/lang/either";

export async function useTestStepFunctionBuilder(
	step: Steps,
	params: Partial<BuildStepFunctionParams> = {},
) {
	const result = await buildStepFunction(
		step,
		{
			environment: "DEV",
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultExtractStepFunctionBuilder,
				defaultHandlerStepFunctionBuilder,
			],
			defaultExtractOtherwise: defaultExtractOtherwise,
			defaultCodecs: {},
			...params,
		},
	);

	if (DEither.isLeft(result)) {
		throw new Error("Step is not support.");
	}

	return DEither.unwrapRight(result);
}
