import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
import * as DSFile from '../../file';
export declare function parseEnvironmentLine(line: string): Record<string, string>;
export declare function parseEnvironmentFiles(baseEnv: Record<string, string>, paths: (string & DPath.Path)[]): Promise<DEither.Left<"file-system-read-text-file-error", DSFile.ReadTextFileErrors> | Record<string, string>[]>;
