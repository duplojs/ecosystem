import { BuildRouteFunctionParams } from '../functionsBuilders';
import { HandlerStep } from '../steps';
import { RouterElementSystem } from './types';
interface CreateRouterElementSystemParams {
    handlerStep: HandlerStep;
    buildParams: BuildRouteFunctionParams;
}
export declare function createRouterElementSystem(params: CreateRouterElementSystemParams): Promise<RouterElementSystem>;
export {};
