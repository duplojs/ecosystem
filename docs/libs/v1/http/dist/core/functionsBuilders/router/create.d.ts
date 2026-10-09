import { Request } from '../../request';
import { BuildedRouter } from '../../router';
import { RouterElementSystem } from '../../router/types/routerElementSystem';
import { RouterElementWrapper } from '../../router/types/routerElementWrapper';
import { Environment } from '../../types';
import type * as DCommon from "@duplojs-v1/lang/common";
export interface RouterFunctionBuilderParams {
    readonly environment: Environment;
    readonly routerElementWrapper: RouterElementWrapper;
    readonly classRequest: typeof Request;
    readonly notfoundRouterElement: RouterElementSystem;
    readonly malformedUrlRouterElement: RouterElementSystem;
}
export type RouterFunctionBuilder = (params: RouterFunctionBuilderParams) => DCommon.MaybePromise<BuildedRouter>;
export declare function createRouterFunctionBuilder(theFunction: RouterFunctionBuilder): RouterFunctionBuilder;
