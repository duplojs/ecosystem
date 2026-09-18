import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import { type Steps } from "../../steps/types";
import { type BuildStepNotSupportEither, type StepFunctionBuilderParams, type createStepFunctionBuilder } from "./create";
import { type Environment } from "@core/types";
import { type ResponseContract } from "@core/response";

export interface BuildStepFunctionParams {
	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
	readonly environment: Environment;
	readonly defaultExtractContract: ResponseContract.Contract;
}

export function buildStepFunction(
	step: Steps,
	params: BuildStepFunctionParams,
) {
	const functionParams: StepFunctionBuilderParams = {
		success(value) {
			return DEither.right("buildSuccess", value);
		},
		buildStep(step) {
			return buildStepFunction(step, params);
		},
		environment: params.environment,
		defaultExtractContract: params.defaultExtractContract,
	};

	return DGenerator.asyncReduce(
		params.stepFunctionBuilders,
		DGenerator.reduceFrom<BuildStepNotSupportEither>(DEither.left("stepNotSupport", step)),
		async({
			item: functionBuilder,
			lastValue,
			next,
			exit,
		}) => {
			const result = await functionBuilder(step, functionParams);

			if (DEither.isLeft(result)) {
				if (DEither.unwrapLeft(result) !== step) {
					return exit(result);
				}
				return next(lastValue);
			}

			return exit(result);
		},
	);
}
