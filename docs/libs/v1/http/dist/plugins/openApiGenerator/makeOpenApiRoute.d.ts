import { ResponseContract } from '../../core/response';
import { RoutePath } from '../../core/route';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export declare function makeOpenApiRoute(routePath: RoutePath, openApiPage: string): import('../../core/route').Route<{
    readonly method: "GET";
    readonly metadata: readonly [import('../../core/metadata').Metadata<"ignore-by-route-store", unknown>, import('../../core/metadata').Metadata<"ignore-by-open-api-generator", unknown>, import('../../core/metadata').Metadata<"ignore-by-code-generator", unknown>];
    readonly hooks: readonly [];
    readonly preflightSteps: readonly [];
    readonly paths: readonly [`/${string}`];
    readonly bodyController: null;
    readonly steps: readonly [import('../../core/steps').HandlerStep<{
        readonly responseContract: NoInfer<ResponseContract.Contract<"200", "swaggerUi", NoInfer<DDataStructure.TypeStructure<string, readonly []>>>>;
        theFunction(floor: {}, params: import('../../core/steps').HandlerStepFunctionParams<import('../../core/response').PredictedResponse<"200", "swaggerUi", string>>): import('@duplojs-v1/lang').MaybePromise<import('../../core/response').PredictedResponse<"200", "swaggerUi", string>>;
        readonly metadata: readonly [];
    }>];
}>;
