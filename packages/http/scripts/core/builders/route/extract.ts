import { type RouteDefinition } from "@core/route";
import { createExtractStep, type ExtractStepOtherwiseParams, type ExtractShape, type ExtractStep } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DObject from "@duplojs/lang/object";
import { routeBuilderHandler } from "./builder";
import { type PredictedResponse } from "@core/response";
import { type Request } from "@core/request";
import { type Metadata } from "@core/metadata";
import { type ExtractParamsKeyFromPath, type Floor } from "@core/types";

type HandleParamsInference<
	GenericShape extends ExtractShape,
	GenericPath extends string,
> = (
	& GenericShape
	& {
		params?: ExtractParamsKeyFromPath<GenericPath> extends infer InferredKey extends string
			? (
				& Partial<Record<InferredKey, DDataStructure.Structure>>
				& Record<string, DDataStructure.Structure>
				& Record<Exclude<keyof GenericShape["params"], InferredKey>, never>
			)
			: {};
	}
);

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
	> {
		extract<
			GenericShape extends ExtractShape<Request>,
			GenericResponse extends PredictedResponse = never,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			shape: HandleParamsInference<
				GenericShape,
				GenericDefinition["paths"][number]
			>,
			otherwise?: (
				param: ExtractStepOtherwiseParams<GenericFloor>,
			) => GenericResponse,
			...metadata: GenericMetadata,
		): RouteBuilder<
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
									: (param: ExtractStepOtherwiseParams<GenericFloor>) => GenericResponse;
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

routeBuilderHandler.set(
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
