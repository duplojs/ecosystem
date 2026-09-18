import { type CheckerFunctionParams, checkerOutputKind } from "@core/checker";
import { createStepFunctionBuilder } from "../create";
import { checkerStepKind, presetCheckerStepKind } from "@core/steps";
import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";
import { type Floor } from "@core/types";
import { PredictedResponse } from "@core/response";

export const defaultCheckerStepFunctionBuilder = createStepFunctionBuilder(
	(element) => checkerStepKind.has(element) || presetCheckerStepKind.has(element),
	(step, { success }) => {
		const {
			checkerOptions,
			checkerFunction,
			input,
			responseContract,
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
					responseContract: definition.responseContract,
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
					input: definition.input,
					responseContract: definition.presetChecker.definition.responseContract,
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
				(expectedInformation) => ((information: string) => information === expectedInformation),
			),
			DPattern.otherwise(
				(expectedInformation) => ((information: string) => expectedInformation.includes(information)),
			),
		);

		function getResponse() {
			return new PredictedResponse(
				responseContract.code,
				responseContract.information,
				undefined,
			);
		}

		function treatResult(
			output: ReturnType<CheckerFunctionParams["output"]>,
			floor: Floor,
		) {
			if (!expectedResult(output.information)) {
				return getResponse();
			}

			if (indexing) {
				return {
					...floor,
					[indexing]: output.value,
				};
			}

			return floor;
		}

		return success({
			buildedFunction: (_request, floor) => {
				const result = checkerFunction(
					input(floor),
					{
						options: getOptions(floor),
						output,
					},
				);

				if (result instanceof Promise) {
					return result.then(
						(awaitedResult) => treatResult(awaitedResult, floor),
					);
				}

				return treatResult(result, floor);
			},
			hooksRouteLifeCycle: [],
		});
	},
);
