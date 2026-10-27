import { handlerStepKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import { ResponseHelper } from "@core/response";

export const defaultHandlerStepFunctionBuilder = createStepFunctionBuilder(
	handlerStepKind.has,
	(step, { success }) => {
		const {
			theFunction: handlerFunction,
		} = step.definition;

		return success({
			buildedFunction: async(request, floor) => handlerFunction(
				floor,
				{
					request,
					response: ResponseHelper,
				},
			),
			hooksRouteLifeCycle: [],
		});
	},
);
