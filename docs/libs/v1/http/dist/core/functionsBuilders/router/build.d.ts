import { Environment } from '../../types';
import { createRouterFunctionBuilder } from './create';
import { Request } from '../../request';
import { RouterElementWrapper } from '../../router/types/routerElementWrapper';
import { RouterElementSystem } from '../../router/types/routerElementSystem';
export interface BuildRouterFunctionParams {
    readonly routerFunctionBuilder: ReturnType<typeof createRouterFunctionBuilder>;
    readonly environment: Environment;
    readonly routerElementWrapper: RouterElementWrapper;
    readonly classRequest: typeof Request;
    readonly notfoundRouterElement: RouterElementSystem;
    readonly malformedUrlRouterElement: RouterElementSystem;
}
export declare function buildRouterFunction({ routerFunctionBuilder, ...params }: BuildRouterFunctionParams): Promise<import('../..').BuildedRouter>;
