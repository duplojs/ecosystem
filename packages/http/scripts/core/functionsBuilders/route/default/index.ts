/* eslint-disable @typescript-eslint/prefer-for-of */
import { type HookAfterSendResponse, type HookBeforeRouteExecution, type HookBeforeSendResponse, type HookError, type HookRouteLifeCycle, type HookSendResponse, routeKind } from "@core/route";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { HookResponse, Response } from "@core/response";
import { type Request } from "@core/request";
import { buildHookAfter, buildHookBefore, buildHookErrorBefore, createHookResponse, exitHookFunction, nextHookFunction } from "./hook";
import { createRouteFunctionBuilder } from "../create";
import { buildStepsFunction } from "../../steps";

export * from "./hook";

export const defaultRouteFunctionBuilder = createRouteFunctionBuilder(
	routeKind.has,
	async(
		route,
		{
			success,
			buildStep,
			globalHooksRouteLifeCycle,
		},
	) => {
		const {
			hooks: routeHooks,
			preflightSteps,
			steps,
		} = route.definition;

		const maybeBuildedSteps = await buildStepsFunction(
			steps,
			buildStep,
		);

		if (DEither.isLeft(maybeBuildedSteps)) {
			return maybeBuildedSteps;
		}

		const buildedSteps = maybeBuildedSteps;

		const maybeBuildedPreFlightSteps = await buildStepsFunction(
			preflightSteps,
			buildStep,
		);

		if (DEither.isLeft(maybeBuildedPreFlightSteps)) {
			return maybeBuildedPreFlightSteps;
		}

		const buildedPreFlightSteps = maybeBuildedPreFlightSteps;

		const allHooks = [
			...routeHooks,
			...DArray.flatMap(
				buildedPreFlightSteps,
				({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
			),
			...DArray.flatMap(
				buildedSteps,
				({ hooksRouteLifeCycle }) => hooksRouteLifeCycle,
			),
			...globalHooksRouteLifeCycle,
		];

		const hookAfterSendResponse: readonly HookAfterSendResponse[] = DCommon.pipe(
			allHooks,
			DArray.map(({ afterSendResponse }) => afterSendResponse),
			DArray.filter(DCommon.isType("function")),
			DCommon.forward,
		);
		const hookBeforeRouteExecution: readonly HookBeforeRouteExecution[] = DCommon.pipe(
			allHooks,
			DArray.map(({ beforeRouteExecution }) => beforeRouteExecution),
			DArray.filter(DCommon.isType("function")),
			DCommon.forward,
		);
		const hookBeforeSendResponse: readonly HookBeforeSendResponse[] = DCommon.pipe(
			allHooks,
			DArray.map(({ beforeSendResponse }) => beforeSendResponse),
			DArray.filter(DCommon.isType("function")),
			DCommon.forward,
		);
		const hookError: readonly HookError[] = DCommon.pipe(
			allHooks,
			DArray.map(({ error }) => error),
			DArray.filter(DCommon.isType("function")),
			DCommon.forward,
		);
		const hookSendResponse: readonly HookSendResponse[] = DCommon.pipe(
			allHooks,
			DArray.map(({ sendResponse }) => sendResponse),
			DArray.filter(DCommon.isType("function")),
			DCommon.forward,
		);

		const hooks: Required<HookRouteLifeCycle> = {
			beforeRouteExecution: buildHookBefore(hookBeforeRouteExecution),
			afterSendResponse: buildHookAfter(hookAfterSendResponse),
			beforeSendResponse: buildHookAfter(hookBeforeSendResponse),
			error: buildHookErrorBefore(hookError),
			sendResponse: buildHookAfter(hookSendResponse),
		};

		async function routeExecution(request: Request): Promise<Response> {
			try {
				const beforeRouteExecutionResult = await hooks.beforeRouteExecution({
					request,
					exit: exitHookFunction,
					next: nextHookFunction,
					response: createHookResponse("beforeRouteExecution"),
				});

				if (beforeRouteExecutionResult instanceof Response) {
					return beforeRouteExecutionResult;
				}

				let floor = {};

				for (let index = 0; index < buildedPreFlightSteps.length; index++) {
					const result = await buildedPreFlightSteps[index]!.buildedFunction(request, floor);

					if (result instanceof Response) {
						return result;
					}

					floor = result;
				}

				for (let index = 0; index < buildedSteps.length; index++) {
					const result = await buildedSteps[index]!.buildedFunction(request, floor);

					if (result instanceof Response) {
						return result;
					}

					floor = result;
				}

				return new Response(
					"500",
					"missing-response",
					undefined,
				);
			} catch (error: unknown) {
				const errorResult = await hooks.error({
					request,
					error,
					exit: exitHookFunction,
					next: nextHookFunction,
					response: createHookResponse("error"),
				});

				if (errorResult instanceof HookResponse) {
					return errorResult;
				}

				return new Response(
					"500",
					"server-error",
					error,
				);
			}
		}

		return success(
			async(request) => {
				const currentResponse = await routeExecution(request);

				const afterHookParams = {
					request,
					currentResponse,
					exit: exitHookFunction,
					next: nextHookFunction,
				};

				await hooks.beforeSendResponse(afterHookParams);

				await hooks.sendResponse(afterHookParams);

				await hooks.afterSendResponse(afterHookParams);
			},
		);
	},
);
