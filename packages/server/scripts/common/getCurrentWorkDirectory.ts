import * as DSPath from "@scripts/path";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		getCurrentWorkDirectory(): (
			| DEither.Left<"get-current-work-directory-error", unknown>
			| DEither.Success<string & DPath.Absolute>
		);
	}
}

export const getCurrentWorkDirectory = implementFunction(
	"getCurrentWorkDirectory",
	{
		NODE: () => DCommon.pipe(
			DEither.safeCallback(() => DSPath.createAbsolute(process.cwd())),
			DEither.whenIsLeft((error) => DEither.left("get-current-work-directory-error", error)),
		),
		DENO: () => DCommon.pipe(
			DEither.safeCallback(() => DSPath.createAbsolute(Deno.cwd())),
			DEither.whenIsLeft((error) => DEither.left("get-current-work-directory-error", error)),
		),
	},
);
