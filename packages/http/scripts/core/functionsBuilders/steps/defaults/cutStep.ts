import { type CutStepFunctionParams, cutStepKind, cutStepOutputKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import { PredictedResponse, ResponseHelper } from "@core/response";
import * as DCommon from "@duplojs/lang/common";

export const defaultCutStepFunctionBuilder = createStepFunctionBuilder(
	cutStepKind.has,
	(step, { success }) => {
		const {
			theFunction: cutFunction,
		} = step.definition;

		const output: CutStepFunctionParams["output"] = (
			data,
		) => cutStepOutputKind.setTo(
			{},
			data ?? {} as never,
		);

		return success({
			buildedFunction: async(request, floor) => DCommon.callThen(
				cutFunction(
					floor,
					{
						request,
						output,
						response: ResponseHelper,
					},
				),
				(result) => {
					if (result instanceof PredictedResponse) {
						return result;
					}

					return {
						...floor,
						...cutStepOutputKind.getValue(result),
					};
				},
			),
			hooksRouteLifeCycle: [],
		});
	},
);
