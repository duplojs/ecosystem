import { createRouteFunctionBuilder, createStepFunctionBuilder } from '../../functionsBuilders';
import { HookHubLifeCycle } from '../../hub';
import { HookRouteLifeCycle, Route } from '../../route';
import { BuildedRouter } from './buildedRouter';
export interface Router {
    exec: BuildedRouter;
    readonly routes: ReadonlySet<Route>;
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
}
