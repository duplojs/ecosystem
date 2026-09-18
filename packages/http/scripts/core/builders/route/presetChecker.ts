import { type Floor } from "@core/types";
import { type RouteDefinition } from "@core/route";
import { createPresetCheckerStep, type PresetCheckerStep } from "@core/steps";
import type * as DObject from "@duplojs/lang/object";
import type * as DArray from "@duplojs/lang/array";
import { routeBuilderHandler } from "./builder";
import { type GetPresetCheckerIndex, type GetPresetCheckerInformation, type GetPresetCheckerResult, type GetPresetCheckerInput, type PresetChecker } from "@core/presetChecker";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface RouteBuilder<
		GenericDefinition extends RouteDefinition = RouteDefinition,
		GenericFloor extends Floor = {},
	> {
		presetCheck<
			GenericPresetChecker extends PresetChecker,
			GenericInput extends GetPresetCheckerInput<GenericPresetChecker>,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			presetChecker: GenericPresetChecker,
			input: (floor: GenericFloor) => GenericInput,
			...metadata: GenericMetadata,
		): RouteBuilder<
			DObject.Assign<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						PresetCheckerStep<
							{
								readonly presetChecker: GenericPresetChecker;
								input(floor: GenericFloor): GenericInput;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			DObject.Assign<
				GenericFloor,
				{
					[Prop in GetPresetCheckerIndex<GenericPresetChecker>]: Extract<
						Awaited<GetPresetCheckerResult<GenericPresetChecker>>,
						{
							information: DArray.Coalescing<
								GetPresetCheckerInformation<GenericPresetChecker>
							>[number];
						}
					>["value"]
				}
			>
		>;
	}
}

routeBuilderHandler.set(
	"presetCheck",
	({
		args: [
			presetChecker,
			input,
			...metadata
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createPresetCheckerStep({
				presetChecker,
				input,
				metadata,
			}),
		],
	}),
);
