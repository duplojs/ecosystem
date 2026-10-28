import * as DString from "@duplojs/lang/string";
import type * as DPath from "@duplojs/lang/path";
export declare function createMainIndex(names: readonly (string & DPath.Segment & DString.AllowedCharacters<"A-Z" | "a-z">)[]): Promise<string>;
