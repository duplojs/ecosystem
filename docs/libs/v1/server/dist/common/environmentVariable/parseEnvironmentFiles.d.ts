import type * as DPath from "@duplojs-v1/lang/path";
import * as DEither from "@duplojs-v1/lang/either";
export declare function parseEnvironmentLine(line: string): Record<string, string>;
export declare function parseEnvironmentFiles(baseEnv: Record<string, string>, paths: (string & DPath.Path)[]): Promise<DEither.Left<"file-system-read-text-file-not-found", unknown> | DEither.Left<"file-system-read-text-file-permission-denied", unknown> | DEither.Left<"file-system-read-text-file-is-directory", unknown> | DEither.Left<"file-system-read-text-file-not-directory", unknown> | DEither.Left<"file-system-read-text-file-too-many-open-files", unknown> | DEither.Left<"file-system-read-text-file-busy", unknown> | DEither.Left<"file-system-read-text-file-error", unknown> | Record<string, string>[]>;
