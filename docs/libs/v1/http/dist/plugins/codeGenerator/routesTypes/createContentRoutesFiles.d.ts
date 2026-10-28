import { TypescriptNativeAPI } from '@duplojs/tools/typescript';
import { createTypescriptInstance } from './createTypescriptInstance';
import * as DInvocation from "@duplojs/lang/invocation";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
export interface UpdateRoutesFilesParams {
    isRoutePath: DPath.PathMatcher;
}
export declare function createContentRoutesFiles(typescriptInstance: DInvocation.GetEvidenceResult<typeof createTypescriptInstance, "typescript-instance">, params: UpdateRoutesFilesParams): Promise<DEither.Success<Map<string & DPath.Path & DPath.Absolute, {
    content: string;
    variablesName: readonly TypescriptNativeAPI.Identifier[];
}> & DInvocation.Evidence<"updated-route-files">>>;
