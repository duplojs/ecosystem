import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { type BuildedStep, type Steps } from "../../steps/types";
import { type HookRouteLifeCycle } from "@core/route";
import { type ResponseContract } from "@core/response";
import { type Environment } from "@core/types";
import { type ExtractShapeCodecs } from "@core/steps";

export interface BuildStepResult {
	readonly buildedFunction: BuildedStep;
	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}

export type BuildStepSuccessEither = DEither.Right<"buildSuccess", BuildStepResult>;

export type BuildStepNotSupportEither = DEither.Left<"stepNotSupport", Steps>;

export interface StepFunctionBuilderParams {
	buildStep(
		element: Steps
	): Promise<
		| BuildStepSuccessEither
		| BuildStepNotSupportEither
	>;

	success(
		result: BuildStepResult
	): BuildStepSuccessEither;

	readonly environment: Environment;

	readonly defaultExtractContract: ResponseContract.Contract;

	readonly defaultCodecs: ExtractShapeCodecs;
}

export function createStepFunctionBuilder<
	GenericSupportStep extends Steps,
>(
	support: (step: Steps) => step is GenericSupportStep,
	builder: (
		step: GenericSupportStep,
		params: StepFunctionBuilderParams,
	) => DCommon.MaybePromise<
		| BuildStepSuccessEither
		| BuildStepNotSupportEither
	>,
) {
	return (
		step: Steps,
		params: StepFunctionBuilderParams,
	): DCommon.MaybePromise<
		| BuildStepSuccessEither
		| BuildStepNotSupportEither
	> => support(step)
		? builder(
			step,
			params,
		)
		: DEither.left("stepNotSupport", step);
}
