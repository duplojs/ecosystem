import { createStepFunctionBuilder } from '../steps';
import { BuildRouteNotSupportEither, createRouteFunctionBuilder } from './create';
import { HookRouteLifeCycle, Route } from '../../route';
import { Environment, ExtractOtherwise } from '../../types';
import { ExtractShapeCodecs } from '../../steps';
export interface BuildRouteFunctionParams {
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly environment: Environment;
    readonly defaultExtractOtherwise: ExtractOtherwise;
    readonly defaultCodecs: ExtractShapeCodecs;
}
export declare function buildRouteFunction(route: Route, params: BuildRouteFunctionParams): Promise<import('..').BuildStepNotSupportEither | import('./create').BuildRouteSuccessEither | BuildRouteNotSupportEither>;
