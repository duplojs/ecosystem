import { type HookRouteLifeCycle, type RouteDefinition, type RoutePath } from "@core/route";
import { type Floor } from "@core/types";
import { type RequestMethods, type BodyController } from "@core/request";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import { type Metadata } from "@core/metadata";

export interface RouteBuilder<
	GenericDefinition extends RouteDefinition = RouteDefinition,
	GenericFloor extends Floor = {},
> extends DCommon.Builder<RouteDefinition> {

}

export const routeBuilderHandler = DCommon.createBuilder<RouteBuilder>(createCoreLibStringIdentifier("route"));

export function useRouteBuilder<
	GenericMethod extends RequestMethods,
	const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]],
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
	const GenericMetadata extends readonly Metadata[] = readonly [],
	const GenericBodyController extends BodyController | null = null,
>(
	method: GenericMethod,
	path: GenericPaths,
	options?: {
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
		metadata?: GenericMetadata;
		bodyController?: GenericBodyController;
	},
): RouteBuilder<
	{
		readonly method: GenericMethod;
		readonly paths: GenericPaths extends string
			? readonly [GenericPaths]
			: GenericPaths;
		readonly preflightSteps: readonly [];
		readonly steps: readonly [];
		readonly hooks: GenericHooks;
		readonly metadata: GenericMetadata;
		readonly bodyController: GenericBodyController;
	},
	{}
> {
	return routeBuilderHandler.use({
		method,
		paths: DArray.coalescing(path),
		preflightSteps: [],
		steps: [],
		hooks: options?.hooks ?? [],
		metadata: options?.metadata ?? [],
		bodyController: options?.bodyController ?? null,
	});
}
