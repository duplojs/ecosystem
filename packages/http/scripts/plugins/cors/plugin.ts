/* eslint-disable @typescript-eslint/prefer-for-of */
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DArray from "@duplojs/lang/array";
import type * as DObject from "@duplojs/lang/object";
import { type RequestMethods, type Request } from "@core/request";
import type { Response } from "@core/response";
import { type HubPlugin } from "@core/hub";
import { IgnoreRouteCorsMetadata } from "./metadata";
import { createHookRouteLifeCycle, createRoute } from "@core/route";
import { allowHeadersFunction, allowMethodsFunction, allowOriginFunction, credentialsFunction, exposeHeadersFunction, maxAgeFunction, varyFunction } from "./headerFunctions";
import * as DString from "@duplojs/lang/string";

export interface CorsPluginParams {
	readonly allowOrigin?: (
		| string
		| RegExp
		| DCommon.AnyTuple<string>
		| ((origin: string) => DCommon.MaybePromise<boolean>)
		| true
	);
	readonly allowHeaders?: string | DCommon.AnyTuple<string> | true;
	readonly exposeHeaders?: string | DCommon.AnyTuple<string>;
	readonly maxAge?: number;
	readonly credentials?: boolean;
	readonly allowMethods?: RequestMethods | DCommon.AnyTuple<RequestMethods> | true;
}

export function corsPlugin<
	GenericParams extends CorsPluginParams,
>(params: GenericParams & DObject.RequireAtLeastOne<GenericParams>) {
	const headerFunctionOtherRoutes: ((request: Request, response: Response) => void)[] = [];

	if (params.allowOrigin) {
		headerFunctionOtherRoutes.push(
			varyFunction.default(),
		);

		headerFunctionOtherRoutes.push(
			typeof params.allowOrigin === "function"
				? allowOriginFunction.isFunction(params.allowOrigin)
				: allowOriginFunction.default(
					DCommon.toRegExp(
						params.allowOrigin === true
							? "*"
							: params.allowOrigin,
					),
				),
		);
	}

	if (params.exposeHeaders) {
		headerFunctionOtherRoutes.push(
			DCommon.pipe(
				params.exposeHeaders,
				DArray.coalescing,
				DString.join(","),
				exposeHeadersFunction.default,
			),
		);
	}

	if (params.credentials) {
		headerFunctionOtherRoutes.push(
			credentialsFunction.default(),
		);
	}

	const hookOtherRoute = createHookRouteLifeCycle({
		beforeSendResponse: (params) => {
			for (let index = 0; index < headerFunctionOtherRoutes.length; index++) {
				headerFunctionOtherRoutes[index]!(params.request, params.currentResponse);
			}
			return params.next();
		},
	});

	return (): HubPlugin => ({
		name: "cors",
		hooksHubLifeCycle: [
			{
				beforeServerBuildRoutes: (hub) => {
					const headerFunctionRouteOptions: ((request: Request, response: Response) => void)[] = [];

					if (params.allowMethods === true) {
						const allowMethodsFunctionIsBool = DCommon.pipe(
							hub.routes,
							DGenerator.filter(
								(route) => !DArray.some(route.definition.metadata, IgnoreRouteCorsMetadata.is),
							),
							DGenerator.map(
								(route) => DArray.map(
									route.definition.paths,
									(path) => ({
										path,
										method: route.definition.method,
									}),
								),
							),
							DGenerator.flat,
							DGenerator.reduce(
								DGenerator.reduceFrom<Record<string, string>>({}),
								({ item, lastValue, next }) => {
									lastValue[item.path] = lastValue[item.path]
										? `${lastValue[item.path]},${item.method}`
										: item.method;
									return next(lastValue);
								},
							),
							allowMethodsFunction.isBool,
						);

						headerFunctionRouteOptions.push(allowMethodsFunctionIsBool);
					} else if (params.allowMethods) {
						headerFunctionRouteOptions.push(
							DCommon.pipe(
								params.allowMethods,
								DArray.coalescing,
								DString.join(","),
								allowMethodsFunction.default,
							),
						);
					}

					if (params.allowHeaders) {
						headerFunctionRouteOptions.push(
							allowHeadersFunction.default(
								params.allowHeaders === true
									? "*"
									: DCommon.pipe(
										params.allowHeaders,
										DArray.coalescing,
										DString.join(","),
									),
							),
						);
					}

					if (params.maxAge) {
						headerFunctionRouteOptions.push(
							maxAgeFunction.default(params.maxAge.toString()),
						);
					}

					const hookRouteOptions = createHookRouteLifeCycle({
						beforeRouteExecution: (params) => {
							const response = params.response("204", "cors");
							for (let index = 0; index < headerFunctionRouteOptions.length; index++) {
								headerFunctionRouteOptions[index]!(params.request, response);
							}
							return response;
						},
					});

					const routeOptions = createRoute({
						paths: ["/*"],
						method: "OPTIONS",
						hooks: [hookRouteOptions],
						metadata: [IgnoreRouteCorsMetadata()],
						steps: [],
						preflightSteps: [],
						bodyController: null,
					});

					hub.register(routeOptions);

					return hub;
				},
				beforeBuildRoute: (route) => {
					if (route.definition.method === "OPTIONS" || DArray.some(route.definition.metadata, IgnoreRouteCorsMetadata.is)) {
						return route;
					}
					return {
						...route,
						definition: {
							...route.definition,
							hooks: [...route.definition.hooks, hookOtherRoute],
						},
					};
				},
			},
		],
	});
}
