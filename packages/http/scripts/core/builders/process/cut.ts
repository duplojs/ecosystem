import { type Floor } from "@core/types";
import { type PredictedResponse } from "@core/response";
import { type ProcessDefinition } from "@core/process";
import { type CutStepFunctionOutput, type CutStep, type CutStepFunctionParams, createCutStep, type cutStepOutputKind } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import { processBuilder } from "./builder";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		cut<
			GenericOutput extends (
				| CutStepFunctionOutput
				| PredictedResponse
			),
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			theFunction: (
				floor: GenericFloor,
				params: CutStepFunctionParams,
			) => DCommon.MaybePromise<GenericOutput>,
			...metadata: GenericMetadata
		): ProcessBuilder<
			DObject.Assign<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						CutStep<
							{
								theFunction(
									floor: GenericFloor,
									param: CutStepFunctionParams
								): DCommon.MaybePromise<GenericOutput>;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			DCommon.IsNever<
				Extract<GenericOutput, CutStepFunctionOutput>
			> extends true
				? GenericFloor
				: (
					GenericOutput extends infer InferredOutputData extends CutStepFunctionOutput
						? DObject.Assign<
							GenericFloor,
							DKind.GetValue<typeof cutStepOutputKind, InferredOutputData>
						>
						: never
				)
		>;
	}
}

processBuilder.set(
	"cut",
	({
		args: [
			theFunction,
			...metadata
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createCutStep({
				theFunction,
				metadata,
			}),
		],
	}),
);
