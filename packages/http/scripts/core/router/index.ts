import { type Hub, launchHookBeforeBuildRoute } from "@core/hub";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DObject from "@duplojs/lang/object";
import { pathToRegExp } from "./pathToRegExp";
import { RouterBuildError } from "./buildError";
import { NotFoundBodyReaderImplementationError } from "./notFoundBodyReaderImplementationError";
import { buildRouteFunction, type BuildRouteFunctionParams, buildRouterFunction, type createRouteFunctionBuilder, type createStepFunctionBuilder, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, defaultRouterFunctionBuilder } from "@core/functionsBuilders";
import { createRouterElementSystem } from "./createRouterElementSystem";
import { type RouterElementWrapper, type Router } from "./types";

export type * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./notFoundBodyReaderImplementationError";
export * from "./createRouterElementSystem";

export async function createRouter(hub: Hub): Promise<Router> {
	const { environment } = hub.config;
	const {
		hooksRouteLifeCycle,
		routes,
		hooksHubLifeCycle,
		bodyReaderImplementations,
	} = hub;

	const routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[] = [
		...hub.routeFunctionBuilders,
		defaultRouteFunctionBuilder,
	];
	const stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[] = [
		...hub.stepFunctionBuilders,
		defaultCheckerStepFunctionBuilder,
		defaultCutStepFunctionBuilder,
		defaultHandlerStepFunctionBuilder,
		defaultExtractStepFunctionBuilder,
		defaultProcessStepFunctionBuilder,
	];

	const hooksBeforeBuildRoute = DCommon.pipe(
		hooksHubLifeCycle,
		DArray.map(({ beforeBuildRoute }) => beforeBuildRoute),
		DArray.filter(DCommon.isType("function")),
	);

	const buildParams: BuildRouteFunctionParams = {
		environment,
		globalHooksRouteLifeCycle: hooksRouteLifeCycle,
		stepFunctionBuilders,
		routeFunctionBuilders,
		defaultExtractContract: hub.defaultExtractContract,
		defaultCodecs: hub.defaultExtractShapeCodecs,
	};

	const routerElementWrapper = await DGenerator.asyncReduce(
		routes,
		DGenerator.reduceFrom<RouterElementWrapper>({}),
		async({
			lastValue,
			item: route,
			nextWithObject,
		}) => {
			const routeAfterHook = await launchHookBeforeBuildRoute(
				hooksBeforeBuildRoute,
				route,
			);

			const buildedRoute = await buildRouteFunction(
				routeAfterHook,
				buildParams,
			);

			if (DEither.isLeft(buildedRoute)) {
				throw new RouterBuildError(
					route,
					DEither.unwrapLeft(buildedRoute),
				);
			}

			const routeBodyController = route.definition.bodyController ?? hub.defaultBodyController;

			const bodyReader = DCommon.pipe(
				bodyReaderImplementations,
				DArray.reduce(
					DArray.reduceFrom<null>(null),
					({ element, next, exit }) => DCommon.pipe(
						element,
						routeBodyController.tryToCreateReader,
						DEither.whenIsRight(exit),
						DEither.whenIsLeft(DCommon.justReturn(next(null))),
					),
				),
			);

			if (!bodyReader) {
				throw new NotFoundBodyReaderImplementationError(
					route,
					routeBodyController,
				);
			}

			return nextWithObject(
				lastValue,
				{
					[route.definition.method]: DArray.concat(
						lastValue[route.definition.method] ?? [],
						DArray.map(
							route.definition.paths,
							DObject.to({
								pattern: pathToRegExp,
								buildedRoute: DCommon.justReturn(DEither.unwrapRight(buildedRoute)),
								matchedPath: DCommon.forward,
								bodyReader: DCommon.justReturn(bodyReader),
							}),
						),
					),
				},
			);
		},
	);

	const notfoundRouterElement = await createRouterElementSystem({
		handlerStep: hub.notfoundHandler,
		buildParams,
	});

	const malformedUrlRouterElement = await createRouterElementSystem({
		handlerStep: hub.malformedUrlHandler,
		buildParams,
	});

	return {
		exec: await buildRouterFunction({
			environment: hub.config.environment,
			routerElementWrapper,
			notfoundRouterElement: notfoundRouterElement,
			malformedUrlRouterElement: malformedUrlRouterElement,
			classRequest: hub.classRequest,
			routerFunctionBuilder: hub.routerFunctionBuilder ?? defaultRouterFunctionBuilder,
		}),
		hooksRouteLifeCycle,
		routeFunctionBuilders,
		routes,
		stepFunctionBuilders,
		hooksHubLifeCycle,
	};
}
