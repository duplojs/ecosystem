import { type Floor } from "@core/types";
import { createProcessStep, type ProcessStep } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import { processBuilder } from "./builder";
import { type ProcessDefinition, type GetProcessExportValue, type Process } from "@core/process";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface ProcessBuilder<
		GenericDefinition extends ProcessDefinition = ProcessDefinition,
		GenericFloor extends Floor = {},
	> {
		exec<
			GenericProcess extends Process,
			GenericProcessExportValue extends GetProcessExportValue<GenericProcess>,
			const GenericImportation extends readonly Extract<keyof GenericProcessExportValue, string>[] = never,
			GenericOptions extends (
				| GenericProcess["definition"]["options"]
				| ((floor: GenericFloor) => Exclude<GenericProcess["definition"]["options"], undefined>)
			) = never,
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			process: GenericProcess,
			params?: {
				readonly imports?: GenericImportation;
				readonly options?: DCommon.FixDeepFunctionInfer<
					| GenericProcess["definition"]["options"]
					| ((floor: GenericFloor) => GenericProcess["definition"]["options"]),
					GenericOptions
				>;
			},
			...metadata: GenericMetadata
		): ProcessBuilder<
			DObject.Assign<
				GenericDefinition,
				{
					readonly steps: readonly [
						...GenericDefinition["steps"],
						ProcessStep<
							{
								readonly process: GenericProcess;
								readonly options: DCommon.NeverCoalescing<
									Extract<GenericOptions, DCommon.AnyFunction | GenericProcess["definition"]["options"]>,
									undefined
								>;
								readonly imports: DCommon.NeverCoalescing<GenericImportation, undefined>;
								readonly metadata: GenericMetadata;
							}
						>,
					];
				}
			>,
			DObject.Assign<
				GenericFloor,
				Pick<
					GenericProcessExportValue,
					GenericImportation[number]
				>
			>
		>;
	}
}

processBuilder.set(
	"exec",
	({
		args: [
			process,
			params,
			...metadata
		],
		accumulator,
		next,
	}) => next({
		...accumulator,
		steps: [
			...accumulator.steps,
			createProcessStep({
				...params,
				process,
				metadata,
			}),
		],
	}),
);
