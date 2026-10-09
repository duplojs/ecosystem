import { createStepFunctionBuilder } from '../steps';
import { BuildRouteNotSupportEither, createRouteFunctionBuilder } from './create';
import { HookRouteLifeCycle, Route } from '../../route';
import { ResponseContract } from '../../response';
import { Environment } from '../../types';
import { ExtractShapeCodecs } from '../../steps';
export interface BuildRouteFunctionParams {
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly environment: Environment;
    readonly defaultExtractContract: ResponseContract.Contract;
    readonly defaultCodecs: ExtractShapeCodecs;
}
export declare function buildRouteFunction(route: Route, params: BuildRouteFunctionParams): Promise<import('..').BuildStepNotSupportEither | import('./create').BuildRouteSuccessEither | BuildRouteNotSupportEither>;
