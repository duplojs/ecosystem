import { type CutStepFunctionParams, cutStepKind, cutStepOutputKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { PredictedResponse, ResponseContract } from "@core/response";

export const defaultCutStepFunctionBuilder = createStepFunctionBuilder(
	cutStepKind.has,
	(step, { success }) => {
		const {
			responseContract,
			theFunction: cutFunction,
		} = step.definition;

		const output: CutStepFunctionParams["output"] = (
			data,
		) => cutStepOutputKind.setTo(
			{},
			data ?? {} as never,
		);

		const preparedContractResponse = DArray.reduce(
			DArray.coalescing(responseContract),
			DArray.reduceFrom<Record<string, ResponseContract.Contract>>({}),
			({ element, lastValue, nextWithObject }) => nextWithObject(
				lastValue,
				{
					[element.information]: element,
				},
			),
		);

		const response: CutStepFunctionParams["response"] = (
			information,
			body,
		) => {
			const currentContract = preparedContractResponse[information];

			if (!currentContract) {
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			return new PredictedResponse(
				currentContract.code,
				currentContract.information,
				body,
			) as never;
		};

		return success({
			buildedFunction: async(request, floor) => {
				const cutResult = await cutFunction(
					floor,
					{
						request,
						output,
						response,
					},
				);

				if (cutResult instanceof PredictedResponse) {
					const currentContract = preparedContractResponse[cutResult.information]!;
					const resultBody = await currentContract.body.asyncCheck(
						cutResult.body,
					);

					if (DEither.isLeft(resultBody)) {
						throw new ResponseContract.Error(
							cutResult.information,
							DEither.unwrapLeft(resultBody),
						);
					}

					return cutResult;
				}

				return {
					...floor,
					...cutStepOutputKind.getValue(cutResult),
				};
			},
			hooksRouteLifeCycle: [],
		});
	},
);
