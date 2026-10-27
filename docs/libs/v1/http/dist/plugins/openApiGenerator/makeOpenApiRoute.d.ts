import { RoutePath } from '../../core/route';
export declare function makeOpenApiRoute(routePath: RoutePath, openApiPage: string): import('../../core/route').Route<{
    readonly method: "GET";
    readonly metadata: readonly [import('../../core/metadata').Metadata<"ignore-by-route-store", unknown>, import('../../core/metadata').Metadata<"ignore-by-open-api-generator", unknown>];
    readonly hooks: readonly [];
    readonly preflightSteps: readonly [];
    readonly paths: readonly [`/${string}`];
    readonly bodyController: null;
    readonly steps: readonly [import('../../core/steps').HandlerStep<{
        theFunction(floor: {}, params: import('../../core/steps').HandlerStepFunctionParams): import('@duplojs/lang').MaybePromise<import('../../core/response').PredictedResponse<"200", "swaggerUi", string>>;
        readonly metadata: readonly [];
    }>];
}>;
