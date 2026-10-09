import { Floor } from '../../types';
import { HookRouteLifeCycle, RoutePreFlightSteps } from '../../route';
import { Metadata } from '../../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
export interface PreflightBuilderDefinition {
    readonly preflightSteps: readonly RoutePreFlightSteps[];
    readonly hooks: readonly HookRouteLifeCycle[];
    readonly metadata: readonly Metadata[];
}
export interface PreflightBuilder<GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition, GenericFloor extends Floor = {}> extends DCommon.Builder<PreflightBuilderDefinition> {
}
export declare const preflightBuilder: DCommon.BuilderHandler<PreflightBuilder<PreflightBuilderDefinition, {}>>;
export declare function usePreflightBuilder<const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(options?: {
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
}): PreflightBuilder<{
    readonly preflightSteps: readonly [];
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
}, {}>;
