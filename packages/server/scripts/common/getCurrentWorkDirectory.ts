import { normalizePlatformPath } from "./platformPath";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		getCurrentWorkDirectory(): (
			| DEither.Error<unknown>
			| DEither.Success<string & DPath.Absolute>
		);
	}
}

export const getCurrentWorkDirectory = implementFunction(
	"getCurrentWorkDirectory",
	{
		NODE: () => DCommon.pipe(
			DEither.safeCallback(
				() => DCommon.whenElse(
					normalizePlatformPath(process.cwd()),
					(value) => DCommon.isType(value, "string") && DPath.isAbsolute(value),
					DEither.success,
					DEither.error,
				),
			),
			DEither.whenIsLeft(DEither.error),
		),
		DENO: () => DCommon.pipe(
			DEither.safeCallback(
				() => DCommon.whenElse(
					normalizePlatformPath(Deno.cwd()),
					(value) => DCommon.isType(value, "string") && DPath.isAbsolute(value),
					DEither.success,
					DEither.error,
				),
			),
			DEither.whenIsLeft(DEither.error),
		),
	},
);
