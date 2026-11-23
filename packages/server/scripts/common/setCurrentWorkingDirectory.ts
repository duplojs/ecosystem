import * as DSPath from "@scripts/path";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		setCurrentWorkingDirectory(
			path: string & DPath.Absolute
		): DEither.Left<"set-current-working-directory-error", unknown> | DEither.Ok;
	}
}

export const setCurrentWorkingDirectory = implementFunction(
	"setCurrentWorkingDirectory",
	{
		NODE: (path) => DEither.whenIsRightOtherwise(
			DEither.safeCallback(() => void process.chdir(DSPath.toPlatformPathOrThrow(path))),
			DEither.ok,
			(error) => DEither.left("set-current-working-directory-error", DEither.unwrapLeft(error)),
		),
		DENO: (path) => DEither.whenIsRightOtherwise(
			DEither.safeCallback(() => void Deno.chdir(DSPath.toPlatformPathOrThrow(path))),
			DEither.ok,
			(error) => DEither.left("set-current-working-directory-error", DEither.unwrapLeft(error)),
		),
	},
);
