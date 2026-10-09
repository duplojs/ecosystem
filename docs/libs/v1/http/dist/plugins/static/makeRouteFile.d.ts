import { ResponseContract } from '../../core/response';
import { RoutePath } from '../../core/route';
import { CacheControlDirectives } from '../cacheController/types';
import type * as DSFile from "@duplojs-v1/server/file";
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DKind from "@duplojs-v1/lang/kind";
interface MakeRouteFileParams {
    readonly source: DSFile.FileInterface;
    readonly path: RoutePath | DCommon.AnyTuple<RoutePath>;
    readonly cacheControlConfig?: CacheControlDirectives;
}
declare const MissingSelectedStaticFileError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsStaticPlugin/missing-selected-static-file", unknown>>, ErrorConstructor>;
export declare class MissingSelectedStaticFileError extends MissingSelectedStaticFileError_base {
    source: DSFile.FileInterface;
    constructor(source: DSFile.FileInterface);
}
declare const SelectedStaticFileIsNotFileError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsStaticPlugin/selected-static-file-is-not-file", unknown>>, ErrorConstructor>;
export declare class SelectedStaticFileIsNotFileError extends SelectedStaticFileIsNotFileError_base {
    source: DSFile.FileInterface;
    constructor(source: DSFile.FileInterface);
}
export declare function makeRouteFile(params: MakeRouteFileParams): import('../../core/route').Route<{
    readonly method: "GET";
    readonly metadata: readonly [import('../../core/metadata').Metadata<"ignore-by-route-store", unknown>];
    readonly hooks: readonly [{
        readonly beforeSendResponse: ({ currentResponse, next }: import('../../core/route').RouteHookParamsAfter) => import('../../core/route').RouteHookNext;
    }];
    readonly paths: readonly [`/${string}`] | DCommon.AnyTuple<`/${string}`>;
    readonly preflightSteps: readonly [];
    readonly bodyController: null;
    readonly steps: readonly [import('../../core/steps').HandlerStep<{
        readonly responseContract: [NoInfer<ResponseContract.Contract<"200", "resource.found", NoInfer<import('@duplojs-v1/lang/dataStructure').TypeStructure<DSFile.FileInterface, readonly []>>>>, NoInfer<ResponseContract.Contract<"304", "resource.notModified", import('@duplojs-v1/lang/dataStructure').TypeStructure<undefined, readonly []>>>];
        theFunction(floor: {}, params: import('../../core/steps').HandlerStepFunctionParams<import('../../core/response').PredictedResponse<"200", "resource.found", DSFile.FileInterface> | import('../../core/response').PredictedResponse<"304", "resource.notModified", undefined>>): DCommon.MaybePromise<import('../../core/response').PredictedResponse<"200", "resource.found", DSFile.FileInterface> | import('../../core/response').PredictedResponse<"304", "resource.notModified", undefined>>;
        readonly metadata: readonly [];
    }>];
}>;
export {};
