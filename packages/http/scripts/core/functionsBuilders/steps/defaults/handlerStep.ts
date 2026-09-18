/* eslint-disable @typescript-eslint/prefer-for-of */
import { type HandlerStepFunctionParams, handlerStepKind } from "@core/steps";
import { createStepFunctionBuilder } from "../create";
import type * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { PredictedResponse, ResponseContract, ServerSentEventsPredictedResponse, StreamPredictedResponse, StreamTextPredictedResponse } from "@core/response";

export const defaultHandlerStepFunctionBuilder = createStepFunctionBuilder(
	handlerStepKind.has,
	(step, { success }) => {
		const {
			responseContract,
			theFunction: handlerFunction,
		} = step.definition;

		const preparedContractResponse = DArray.reduce(
			DArray.coalescing(responseContract),
			DArray.reduceFrom<
				Record<
					string,
					ResponseContract.Contracts
				>
			>({}),
			({ element, lastValue, nextWithObject }) => nextWithObject(
				lastValue,
				{
					[element.information]: element,
				},
			),
		);

		const response: HandlerStepFunctionParams["response"] = (
			information,
			body,
		) => {
			const currentContract = preparedContractResponse[information];

			if (
				!currentContract
				|| !ResponseContract.contractKind.has(currentContract)
			) {
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			const result = currentContract.body.parse(body);
			if (DEither.isLeft(result)) {
				throw new ResponseContract.Error(
					information,
					DEither.unwrapLeft(result),
				);
			}

			return new PredictedResponse(
				currentContract.code,
				information,
				body,
			) as never;
		};

		const serverSentEventsResponse: HandlerStepFunctionParams["serverSentEventsResponse"] = (
			information,
			startSendingEvents,
		) => {
			const currentContract = preparedContractResponse[information];

			if (
				!currentContract
				|| !ResponseContract.serverSentEventsContractKind.has(currentContract)
			) {
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			return new ServerSentEventsPredictedResponse(
				currentContract.code,
				information,
				(params) => startSendingEvents({
					...params,
					send: (event, data, sendParams) => {
						const structure = currentContract.events[event];

						if (!structure) {
							console.error(new ResponseContract.Error(information, `Event '${event}' not found.`));
							return Promise.resolve();
						}

						const result = structure.parse(data);

						if (DEither.isLeft(result)) {
							console.error(new ResponseContract.Error(information, DEither.unwrapLeft(result)));
							return Promise.resolve();
						}

						return params.send(event, data, sendParams);
					},
				}),
			) as never;
		};

		const streamResponse: HandlerStepFunctionParams["streamResponse"] = (
			information,
			startStream,
		) => {
			const currentContract = preparedContractResponse[information];

			if (
				!currentContract
				|| !ResponseContract.streamContractKind.has(currentContract)
			) {
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			return new StreamPredictedResponse(
				currentContract.code,
				information,
				(params) => startStream({
					...params,
					send: (...args: DCommon.AnyTuple<unknown>) => {
						for (let index = 0; index < args.length; index++) {
							const result = currentContract.flux.parse(args[index]);

							if (DEither.isLeft(result)) {
								console.error(new ResponseContract.Error(information, DEither.unwrapLeft(result)));
								return Promise.resolve();
							}
						}

						return params.send(...args);
					},
				}),
			) as never;
		};

		const streamTextResponse: HandlerStepFunctionParams["streamTextResponse"] = (
			information,
			startStreamText,
		) => {
			const currentContract = preparedContractResponse[information];

			if (
				!currentContract
				|| !ResponseContract.streamTextContractKind.has(currentContract)
			) {
				throw new ResponseContract.Error(information, "Contract not found.");
			}

			return new StreamTextPredictedResponse(
				currentContract.code,
				information,
				startStreamText,
			) as never;
		};

		return success({
			buildedFunction: async(request, floor) => handlerFunction(
				floor,
				{
					request,
					response,
					serverSentEventsResponse,
					streamResponse,
					streamTextResponse,
				},
			),
			hooksRouteLifeCycle: [],
		});
	},
);
