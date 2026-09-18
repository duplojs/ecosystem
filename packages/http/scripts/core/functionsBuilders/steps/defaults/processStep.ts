import { processStepKind, type Steps } from "@core/steps";
import { Response } from "@core/response";
import { type BuildStepResult, createStepFunctionBuilder, type StepFunctionBuilderParams } from "../create";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPattern from "@duplojs/lang/pattern";
import { type Floor } from "@core/types";

export function buildStepsFunction(
	steps: readonly Steps[],
	buildStep: StepFunctionBuilderParams["buildStep"],
) {
	return DGenerator.asyncReduce(
		steps,
		DGenerator.reduceFrom<readonly BuildStepResult[]>([]),
		async({ lastValue, item: step, next, exit }) => {
			const result = await buildStep(step);

			if (DEither.isLeft(result)) {
				return exit(result);
			}

			return next(
				DArray.push(lastValue, DEither.unwrapRight(result)),
			);
		},
	);
}

export const defaultProcessStepFunctionBuilder = createStepFunctionBuilder(
	processStepKind.has,
	async(step, { success, buildStep }) => {
		const {
			process,
			imports,
			options: stepOptions,
		} = step.definition;

		const {
			steps,
			hooks: processHook,
			options: processOptions,
		} = process.definition;

		const maybeBuildedSteps = await buildStepsFunction(
			steps,
			buildStep,
		);

		if (DEither.isLeft(maybeBuildedSteps)) {
			return maybeBuildedSteps;
		}

		const buildedSteps = maybeBuildedSteps;

		const getOptions = DCommon.pipe(
			stepOptions ?? processOptions,
			DPattern.when(
				DCommon.or([
					DCommon.isType("object"),
					DCommon.isType("undefined"),
				]),
				(options) => (() => options),
			),
			DPattern.otherwise(DCommon.forward),
		);

		return success({
			buildedFunction: async(request, floor) => {
				let processFloor: Floor = { options: getOptions(floor) };

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let index = 0; index < buildedSteps.length; index++) {
					const result = await buildedSteps[index]!.buildedFunction(request, processFloor);

					if (result instanceof Response) {
						return result;
					}

					processFloor = result;
				}

				if (imports) {
					const newFloor = { ...floor };

					// eslint-disable-next-line @typescript-eslint/prefer-for-of
					for (let index = 0; index < imports.length; index++) {
						newFloor[imports[index] as never] = processFloor[imports[index] as never];
					}

					return newFloor;
				}

				return floor;
			},
			hooksRouteLifeCycle: [
				...processHook,
				...DArray.flatMap(
					buildedSteps,
					({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
				),
			],
		});
	},
);
