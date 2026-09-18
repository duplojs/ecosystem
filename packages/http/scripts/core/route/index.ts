import type * as DObject from "@duplojs/lang/object";
import { createKind } from "../kind";
import { type BodyController, type RequestMethods } from "../request";
import { type ExtractStep, type CheckerStep, type CutStep, type HandlerStep, type ProcessStep, type stepKind, type PresetCheckerStep } from "../steps";
import { type HookRouteLifeCycle } from "./hooks";
import { type Metadata } from "@core/metadata";
import type * as DKind from "@duplojs/lang/kind";

export type * from "./types";
export * from "./hooks";

export interface RouteStepsCustom {}

export type RouteSteps = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| RouteStepsCustom[
		DObject.GetPropsWithValueExtends<
			RouteStepsCustom,
			DKind.Kind<typeof stepKind>
		>
	]
	| CheckerStep
	| PresetCheckerStep
	| ProcessStep
	| ExtractStep
	| CutStep
	| HandlerStep
);

export interface RoutePreFlightStepsCustom {}

export type RoutePreFlightSteps = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| RoutePreFlightStepsCustom[
		DObject.GetPropsWithValueExtends<
			RoutePreFlightStepsCustom,
			DKind.Kind<typeof stepKind>
		>
	]
	| ProcessStep
);

export type RoutePath = `/${string}`;

export interface RouteDefinition {
	readonly paths: readonly [RoutePath, ...RoutePath[]];
	readonly method: RequestMethods;
	readonly preflightSteps: readonly RoutePreFlightSteps[];
	readonly steps: readonly RouteSteps[];
	readonly hooks: readonly HookRouteLifeCycle[];
	readonly metadata: readonly Metadata[];
	readonly bodyController: BodyController | null;
}

export const routeKind = createKind("route");

export interface Route<
	GenericDefinition extends RouteDefinition = RouteDefinition,
> extends DKind.Kind<typeof routeKind> {
	readonly definition: GenericDefinition;
}

export function createRoute<
	GenericDefinition extends RouteDefinition,
>(
	definition: GenericDefinition,
): Route<GenericDefinition> {
	return routeKind.setTo(
		{ definition },
		null,
	);
}
