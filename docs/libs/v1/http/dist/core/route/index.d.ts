import { BodyController, RequestMethods } from '../request';
import { ExtractStep, CheckerStep, CutStep, HandlerStep, ProcessStep, stepKind, PresetCheckerStep } from '../steps';
import { HookRouteLifeCycle } from './hooks';
import { Metadata } from '../metadata';
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DKind from "@duplojs-v1/lang/kind";
export type * from './types';
export * from './hooks';
export interface RouteStepsCustom {
}
export type RouteSteps = (RouteStepsCustom[DObject.GetPropsWithValueExtends<RouteStepsCustom, DKind.Kind<typeof stepKind>>] | CheckerStep | PresetCheckerStep | ProcessStep | ExtractStep | CutStep | HandlerStep);
export interface RoutePreFlightStepsCustom {
}
export type RoutePreFlightSteps = (RoutePreFlightStepsCustom[DObject.GetPropsWithValueExtends<RoutePreFlightStepsCustom, DKind.Kind<typeof stepKind>>] | ProcessStep);
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
export declare const routeKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/route", unknown>>;
export interface Route<GenericDefinition extends RouteDefinition = RouteDefinition> extends DKind.Kind<typeof routeKind> {
    readonly definition: GenericDefinition;
}
export declare function createRoute<GenericDefinition extends RouteDefinition>(definition: GenericDefinition): Route<GenericDefinition>;
