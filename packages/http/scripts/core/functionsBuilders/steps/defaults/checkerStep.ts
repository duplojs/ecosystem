import { type CheckerFunctionParams, checkerOutputKind } from "@core/checker";
import { createStepFunctionBuilder } from "../create";
import { checkerStepKind, presetCheckerStepKind } from "@core/steps";
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";
import { ResponseHelper } from "@core/response";
import { type Floor } from "@core/types";

export const defaultCheckerStepFunctionBuilder = createStepFunctionBuilder(
	(element) => checkerStepKind.has(element) || presetCheckerStepKind.has(element),
	(step, { success }) => {
		const {
			checkerOptions,
			checkerFunction,
			input,
			otherwise,
			stepResult,
			indexing,
			stepOptions,
		} = DCommon.pipe(
			step,
			DPattern.when(
				checkerStepKind.has,
				({ definition }) => ({
					checkerOptions: definition.checker.definition.options,
					checkerFunction: definition.checker.definition.theFunction,
					input: definition.input,
					otherwise: definition.otherwise,
					stepResult: definition.result,
					indexing: definition.indexing,
					stepOptions: definition.options,
				}),
			),
			DPattern.when(
				presetCheckerStepKind.has,
				({ definition }) => ({
					checkerOptions: definition.presetChecker.definition.checker.definition.options,
					checkerFunction: definition.presetChecker.definition.checker.definition.theFunction,
					input: DCommon.justExec(() => {
						const rewriteInput = definition.presetChecker.definition.rewriteInput;

						return rewriteInput
							? (floor: Floor) => rewriteInput(
								definition.input(floor),
							)
							: definition.input;
					}),
					otherwise: definition.presetChecker.definition.otherwise,
					stepResult: definition.presetChecker.definition.result,
					indexing: definition.presetChecker.definition.indexing,
					stepOptions: definition.presetChecker.definition.options,
				}),
			),
			DPattern.exhaustive,
		);

		const getOptions = DCommon.pipe(
			stepOptions ?? checkerOptions,
			DPattern.when(
				DCommon.or([
					DCommon.isType("object"),
					DCommon.isType("undefined"),
				]),
				(options) => (() => options),
			),
			DPattern.otherwise(DCommon.forward),
		);

		const output: CheckerFunctionParams["output"] = (
			information,
			value,
		) => checkerOutputKind.setTo({
			information,
			value,
		}, null);

		const expectedResult = DCommon.pipe(
			stepResult,
			DPattern.when(
				DCommon.isType("string"),
				(expectedInformation) => (
					(information: string) => information === expectedInformation
				),
			),
			DPattern.when(
				DCommon.isType("array"),
				(expectedInformation) => (
					(information: string) => expectedInformation.includes(information)
				),
			),
			DPattern.exhaustive,
		);

		return success({
			buildedFunction: (_request, floor) => DCommon.callThen(
				checkerFunction(
					input(floor),
					{
						options: getOptions(floor),
						output,
					},
				),
				(output) => {
					if (!expectedResult(output.information)) {
						return otherwise({
							response: ResponseHelper,
							floor,
							result: output,
						});
					}

					if (indexing) {
						return {
							...floor,
							[indexing]: output.value,
						};
					}

					return floor;
				},
			),
			hooksRouteLifeCycle: [],
		});
	},
);
