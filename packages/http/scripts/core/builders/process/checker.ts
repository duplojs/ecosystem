import { type Floor } from "@core/types";
import { createCheckerStep, type CheckerStep } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DArray from "@duplojs/lang/array";
import { processBuilder } from "./builder";
import { type GetCheckerResult, type Checker, type GetCheckerInput, type GetCheckerOptions } from "@core/checker";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type ProcessDefinition } from "@core/process";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		check<
			GenericChecker extends Checker,
			GenericResultInformation extends DCommon.MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>,
			GenericInput extends GetCheckerInput<GenericChecker>,
			GenericResponseContract extends ResponseContract.Contract<
				ClientErrorResponseCode,
				string,
				DDataStructure.Structure<undefined>
			>,
			GenericIndex extends string = never,
			GenericOptions extends (
				| GetCheckerOptions<GenericChecker>
				| ((floor: GenericFloor) => Exclude<GetCheckerOptions<GenericChecker>, undefined>)
			) = never,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			checker: GenericChecker,
			params: {
				input(floor: GenericFloor): GenericInput;
				readonly result: GenericResultInformation;
				readonly indexing?: GenericIndex;
				readonly options?: DCommon.FixDeepFunctionInfer<
					| GenericChecker["definition"]["options"]
					| ((floor: GenericFloor) => GenericChecker["definition"]["options"]),
					GenericOptions
				>;
				readonly otherwise: GenericResponseContract;
			},
			...metadata: GenericMetadata
		): ProcessBuilder<
			DObject.Assign<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						CheckerStep<
							{
								readonly checker: GenericChecker;
								readonly result: GenericResultInformation;
								readonly indexing: DCommon.NeverCoalescing<GenericIndex, undefined>;
								input(floor: GenericFloor): GenericInput;
								readonly options: DCommon.NeverCoalescing<
									Extract<GenericOptions, DCommon.AnyFunction | GenericChecker["definition"]["options"]>,
									undefined
								>;
								readonly responseContract: GenericResponseContract;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			DObject.Assign<
				GenericFloor,
				{
					[Prop in GenericIndex]: Extract<
						Awaited<GetCheckerResult<GenericChecker>>,
						{
							information: DArray.Coalescing<
								GenericResultInformation
							>[number];
						}
					>["value"]
				}
			>
		>;
	}
}

processBuilder.set(
	"check",
	({
		args: [
			checker,
			{
				otherwise: responseContract,
				...params
			},
			...metadata
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createCheckerStep({
				...params,
				responseContract,
				checker,
				metadata,
			}),
		],
	}),
);
