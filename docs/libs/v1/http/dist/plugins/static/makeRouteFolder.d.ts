import { ResponseContract } from '../../core/response';
import { RoutePath } from '../../core/route';
import { CacheControlDirectives } from '../cacheController/types';
import * as DSFile from "@duplojs-v1/server/file";
import * as DCommon from "@duplojs-v1/lang/common";
import * as DPath from "@duplojs-v1/lang/path";
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
    readonly paths: readonly [`/${string}/*`] | readonly [`/${string}/*`, ...`/${string}/*`[]];
    readonly preflightSteps: readonly [];
    readonly bodyController: null;
    readonly steps: readonly [import('../../core/steps').HandlerStep<{
        readonly responseContract: [NoInfer<ResponseContract.Contract<"200", "resource.found", NoInfer<import('@duplojs-v1/lang/dataStructure').TypeStructure<DSFile.FileInterface, readonly []>>>>, NoInfer<ResponseContract.Contract<"404", "resource.notfound", import('@duplojs-v1/lang/dataStructure').TypeStructure<undefined, readonly []>>>, NoInfer<ResponseContract.Contract<"304", "resource.notModified", import('@duplojs-v1/lang/dataStructure').TypeStructure<undefined, readonly []>>>];
        theFunction(floor: {}, params: import('../../core/steps').HandlerStepFunctionParams<import('../../core/response').PredictedResponse<"200", "resource.found", DSFile.FileInterface> | import('../../core/response').PredictedResponse<"404", "resource.notfound", undefined> | import('../../core/response').PredictedResponse<"304", "resource.notModified", undefined>>): DCommon.MaybePromise<import('../../core/response').PredictedResponse<"200", "resource.found", DSFile.FileInterface> | import('../../core/response').PredictedResponse<"404", "resource.notfound", undefined> | import('../../core/response').PredictedResponse<"304", "resource.notModified", undefined>>;
        readonly metadata: readonly [];
    }>];
}>;
export {};
