import { type Floor } from "@core/types";
import { type ResponseContract } from "@core/response";
import { type CutStepFunctionOutput, type CutStep, type CutStepFunctionParams, createCutStep, type cutStepOutputKind } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import type * as DArray from "@duplojs/lang/array";
import { processBuilder } from "./builder";
import { type ProcessDefinition } from "@core/process";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		cut<
			const GenericResponseContract extends (
				| ResponseContract.Contract
				| readonly ResponseContract.Contract[]
			),
			GenericResponse extends ResponseContract.Convert<
				DArray.Coalescing<GenericResponseContract>[number]
			>,
			GenericOutput extends CutStepFunctionOutput | GenericResponse,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			responseContract: GenericResponseContract,
			theFunction: (
				floor: GenericFloor,
				param: CutStepFunctionParams<
					GenericResponse
				>,
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
								readonly responseContract: GenericResponseContract;
								theFunction(
									floor: GenericFloor,
									param: CutStepFunctionParams<
										GenericResponse
									>
								): DCommon.MaybePromise<GenericOutput>;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			DCommon.IsEqual<
				Extract<GenericOutput, CutStepFunctionOutput>,
				never
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
			responseContract,
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
				responseContract,
				theFunction,
				metadata,
			}),
		],
	}),
);
