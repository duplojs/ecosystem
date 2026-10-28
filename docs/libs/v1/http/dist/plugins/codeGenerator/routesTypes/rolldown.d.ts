import { Plugin } from 'rolldown';
import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
export interface GenerateRoutesTypesRolldownParams {
    tsconfig: string & DPath.Path;
    pattern: DCommon.MaybeArray<string>;
}
export declare function generateRoutesTypesRolldown(params: GenerateRoutesTypesRolldownParams): Plugin;
