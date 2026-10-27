import { type Floor } from "@core/types";
import { createExtractStep, type ExtractStepOtherwiseParams, type ExtractShape, type ExtractStep } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DObject from "@duplojs/lang/object";
import { processBuilder } from "./builder";
import { type PredictedResponse } from "@core/response";
import { type ProcessDefinition } from "@core/process";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		extract<
			GenericShape extends ExtractShape,
			GenericResponse extends PredictedResponse = never,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			shape: GenericShape,
			otherwise?: (
				params: ExtractStepOtherwiseParams<GenericFloor>,
			) => GenericResponse,
			...metadata: GenericMetadata
		): ProcessBuilder<
			DObject.Assign<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						ExtractStep<
							{
								readonly shape: GenericShape;
								readonly otherwise: DCommon.IsNever<GenericResponse> extends true
									? undefined
									: (params: ExtractStepOtherwiseParams<GenericFloor>) => GenericResponse;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			DObject.Assign<
				GenericFloor,
				{
					[Prop in keyof GenericShape]: GenericShape[Prop] extends DDataStructure.Structure
						? [Prop, DDataStructure.StructureValue<GenericShape[Prop]>]
						: GenericShape[Prop] extends infer InferredSubShape extends Record<
							string,
							DDataStructure.Structure
						>
							? {
								[
								Prop in keyof InferredSubShape
								]: [Prop, DDataStructure.StructureValue<InferredSubShape[Prop]>]
							}[keyof InferredSubShape]
							: never
				}[keyof GenericShape] extends infer InferredEntry extends DCommon.ObjectEntry
					? DCommon.SimplifyTopLevel<{
						[Entry in InferredEntry as Entry[0]]: Entry[1]
					}>
					: never
			>
		>;
	}
}

processBuilder.set(
	"extract",
	({
		args: [
			shape,
			otherwise,
			...metadata
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createExtractStep({
				shape,
				otherwise,
				metadata,
			}),
		],
	}),
);
