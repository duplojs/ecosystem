import { TypescriptNativeAPI } from '@duplojs/tools/typescript';
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DInvocation from "@duplojs/lang/invocation";
export interface CreateTypescriptInstanceParams {
    tsconfigPath: string & DPath.Absolute;
}
export declare function createTypescriptInstance(params: CreateTypescriptInstanceParams): Promise<DEither.Left<"invalidTsconfigPath", undefined> | DEither.Left<"missingProject", undefined> | DEither.Success<{
    readonly snapshot: TypescriptNativeAPI.Snapshot & {
        readonly operation: TypescriptNativeAPI.SnapshotOperation;
    };
    readonly api: TypescriptNativeAPI.API<false>;
    readonly project: TypescriptNativeAPI.Project<TypescriptNativeAPI.ConfiguredProjectId>;
    readonly workDirectory: string & DPath.Path & DPath.Absolute;
    readonly tsconfigPath: string & DPath.Absolute;
} & DInvocation.Evidence<"typescript-instance">>>;
