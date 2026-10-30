import type * as DCommon from "@scripts/common";
import { createKind } from "./kind";
import type * as DKind from "@scripts/kind";

export interface BeforeStepFunctionParams<
	GenericOutput extends unknown,
	GenericFunction extends DCommon.AnyFunction,
> {
	output: GenericOutput;
	nextFunction: GenericFunction;
}

export const stepKind = createKind("step");

export interface Step<
	GenericOutput extends unknown = unknown,
	GenericFunction extends DCommon.AnyFunction = DCommon.AnyFunction,
> extends DKind.Kind<typeof stepKind> {
	run<
		GenericOutputBeforeStep extends DCommon.MaybePromise<ReturnType<GenericFunction>>,
	>(
		beforeStepFunction: (
			params: BeforeStepFunctionParams<
				GenericOutput,
				GenericFunction
			>,
		) => GenericOutputBeforeStep,
	): GenericOutputBeforeStep;
}

export function createStep<
	GenericOutput extends unknown,
	GenericFunction extends DCommon.AnyFunction,
>(
	output: GenericOutput,
	nextFunction: GenericFunction,
): Step<GenericOutput, GenericFunction> {
	return {
		run: (beforeStepFunction) => beforeStepFunction({
			output,
			nextFunction,
		}),
		[stepKind.runTimeKey]: null,
	} satisfies DKind.Remove<Step> as never;
}
