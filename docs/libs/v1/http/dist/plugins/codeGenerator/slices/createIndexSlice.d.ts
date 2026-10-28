import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
export interface CreateIndexSliceParams {
    workDirectory: string & DPath.Absolute;
    isInSlice: DPath.PathMatcher;
}
export declare function createIndexSlice(params: CreateIndexSliceParams): Promise<DEither.Left<"file-system-walk-directory-error", DSFile.WalkDirectoryErrors> | DEither.Success<string>>;
