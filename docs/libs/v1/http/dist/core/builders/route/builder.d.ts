import { HookRouteLifeCycle, RouteDefinition, RoutePath } from '../../route';
import { Floor } from '../../types';
import { RequestMethods, BodyController } from '../../request';
import { Metadata } from '../../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
export interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> extends DCommon.Builder<RouteDefinition> {
}
export declare const routeBuilderHandler: DCommon.BuilderHandler<RouteBuilder<RouteDefinition, {}>>;
export declare function useRouteBuilder<GenericMethod extends RequestMethods, const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]], const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly [], const GenericBodyController extends BodyController | null = null>(method: GenericMethod, path: GenericPaths, options?: {
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
    bodyController?: GenericBodyController;
}): RouteBuilder<{
    readonly method: GenericMethod;
    readonly paths: GenericPaths extends string ? readonly [GenericPaths] : GenericPaths;
    readonly preflightSteps: readonly [];
    readonly steps: readonly [];
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
    readonly bodyController: GenericBodyController;
}, {}>;
