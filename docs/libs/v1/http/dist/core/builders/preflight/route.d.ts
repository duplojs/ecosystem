import { Floor } from '../../types';
import { RequestMethods, BodyController } from '../../request';
import { HookRouteLifeCycle, RoutePath } from '../../route';
import { RouteBuilder } from '../route';
import { Metadata } from '../../metadata';
declare module "./builder" {
    interface PreflightBuilder<GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition, GenericFloor extends Floor = {}> {
        useRouteBuilder<GenericMethod extends RequestMethods, const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]], const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly [], const GenericBodyController extends BodyController | null = null>(method: GenericMethod, path: GenericPaths, options?: {
            hooks?: GenericHooks | readonly HookRouteLifeCycle[];
            metadata?: GenericMetadata;
            bodyController?: GenericBodyController;
        }): RouteBuilder<{
            readonly method: GenericMethod;
            readonly paths: GenericPaths extends string ? readonly [GenericPaths] : GenericPaths;
            readonly preflightSteps: GenericDefinition["preflightSteps"];
            readonly steps: readonly [];
            readonly hooks: readonly [
                ...GenericHooks,
                ...GenericDefinition["hooks"]
            ];
            readonly metadata: readonly [
                ...GenericMetadata,
                ...GenericDefinition["metadata"]
            ];
            readonly bodyController: GenericBodyController;
        }, GenericFloor>;
    }
}
