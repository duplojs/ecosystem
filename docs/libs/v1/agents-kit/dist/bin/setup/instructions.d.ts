import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
declare const InvalidInstructionsMarkersError_base: abstract new (error: string) => DCommon.DuploJSError<"agents-kit-invalid-instructions-markers", string> & import('@duplojs/lang/kind').Kind<import('@duplojs/lang/kind').Handler<import('@duplojs/lang/kind').Definition<"@DuplojsLangCommon/duplojs-error-agents-kit-invalid-instructions-markers", unknown>>, unknown>;
export declare class InvalidInstructionsMarkersError extends InvalidInstructionsMarkersError_base {
}
export declare function synchronizeInstructions(content: string, instructions: string, packagePath: string & DPath.Path): DEither.Left<"agents-kit-invalid-instructions-markers", InvalidInstructionsMarkersError> | DEither.Success<string>;
export {};
