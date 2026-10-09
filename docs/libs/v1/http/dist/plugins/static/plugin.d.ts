import { HubPlugin } from '../../core/hub';
import { RoutePath } from '../../core/route';
import { CacheControlDirectives } from '../cacheController/types';
import * as DCommon from "@duplojs-v1/lang/common";
import * as DSFile from "@duplojs-v1/server/file";
import * as DKind from "@duplojs-v1/lang/kind";
import type * as DPath from "@duplojs-v1/lang/path";
export interface BaseStaticPluginParams {
    readonly cacheControlConfig?: CacheControlDirectives;
}
export interface StaticPluginFileParams extends BaseStaticPluginParams {
    readonly path: RoutePath | DCommon.AnyTuple<RoutePath>;
}
export interface StaticPluginFolderParams extends BaseStaticPluginParams {
    readonly prefix: RoutePath | DCommon.AnyTuple<RoutePath>;
    readonly directoryFallBackFile?: string & DPath.Segment;
}
declare const StaticPluginError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsStaticPlugin/static-plugin", unknown>>, ErrorConstructor>;
export declare class StaticPluginError extends StaticPluginError_base {
    information: string;
    error: unknown;
    constructor(information: string, error: unknown);
}
export declare function staticPlugin(source: DSFile.FolderInterface, params: StaticPluginFolderParams): HubPlugin;
export declare function staticPlugin(source: DSFile.FileInterface, params: StaticPluginFileParams): HubPlugin;
export {};
