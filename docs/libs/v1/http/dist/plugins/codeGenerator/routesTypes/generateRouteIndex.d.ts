import { createTypescriptInstance } from './createTypescriptInstance';
import { createContentRoutesFiles } from './createContentRoutesFiles';
import * as DInvocation from "@duplojs/lang/invocation";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
export declare function generateRouteIndex(typescriptInstance: DInvocation.GetEvidenceResult<typeof createTypescriptInstance, "typescript-instance">, files: DInvocation.GetEvidenceResult<typeof createContentRoutesFiles, "updated-route-files">): Promise<DEither.Left<"failToCreatePathKey", undefined> | (readonly [string & DPath.Path & DPath.Absolute, string] & DInvocation.Evidence<"generated-route-index-entry">)>;
