import { RoutePath } from '../../core/route';
import { CacheControlDirectives } from '../cacheController/types';
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
interface MakeRouteFolderParams {
    readonly source: DSFile.FolderInterface;
    readonly prefix: RoutePath | DCommon.AnyTuple<RoutePath>;
    readonly cacheControlConfig?: CacheControlDirectives;
    readonly directoryFallBackFile?: string & DPath.Segment;
}
export declare function makeRouteFolder(params: MakeRouteFolderParams): import('../../core/route').Route<{
    readonly method: "GET";
    readonly metadata: readonly [import('../../core/metadata').Metadata<"ignore-by-route-store", unknown>];
    readonly hooks: readonly [{
        readonly beforeSendResponse: ({ currentResponse, next }: import('../../core/route').RouteHookParamsAfter) => import('../../core/route').RouteHookNext;
    }];
    readonly preflightSteps: readonly [];
    readonly paths: readonly [`/${string}/*`] | readonly [`/${string}/*`, ...`/${string}/*`[]];
    readonly bodyController: null;
    readonly steps: readonly [import('../../core/steps').HandlerStep<{
        theFunction(floor: {}, params: import('../../core/steps').HandlerStepFunctionParams): DCommon.MaybePromise<import('../../core/response').PredictedResponse<"404", "resource.notfound", undefined> | import('../../core/response').PredictedResponse<"304", "resource.notModified", undefined> | import('../../core/response').PredictedResponse<"200", "resource.found", DSFile.FileInterface<string & DPath.Path>>>;
        readonly metadata: readonly [];
    }>];
}>;
export {};
