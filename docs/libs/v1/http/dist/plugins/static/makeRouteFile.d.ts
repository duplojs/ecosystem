import { RoutePath } from '../../core/route';
import { CacheControlDirectives } from '../cacheController/types';
import type * as DSFile from "@duplojs/server/file";
import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";
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
    readonly preflightSteps: readonly [];
    readonly paths: readonly [`/${string}`] | DCommon.AnyTuple<`/${string}`>;
    readonly bodyController: null;
    readonly steps: readonly [import('../../core/steps').HandlerStep<{
        theFunction(floor: {}, params: import('../../core/steps').HandlerStepFunctionParams): DCommon.MaybePromise<import('../../core/response').PredictedResponse<"304", "resource.notModified", undefined> | import('../../core/response').PredictedResponse<"200", "resource.found", DSFile.FileInterface<import('@duplojs/lang/path').AnyPath>>>;
        readonly metadata: readonly [];
    }>];
}>;
export {};
