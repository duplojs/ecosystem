import { Plugin } from 'rolldown';
import * as DPath from "@duplojs/lang/path";
import type * as DString from "@duplojs/lang/string";
export interface SlicesParams {
    name: string & DPath.Segment & DString.AllowedCharacters<"a-z" | "A-Z">;
    pattern: string | string[];
}
export interface GenerateSlicesRolldownParams {
    slices: SlicesParams[];
    workDirectory?: string & DPath.Path;
}
export declare function generateSlicesRolldown(params: GenerateSlicesRolldownParams): Plugin;
