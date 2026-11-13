import { toPlatformPathOrThrow } from "./platformPath";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		setCurrentWorkingDirectory(
			path: string & DPath.Absolute
		): DEither.Fail | DEither.Ok;
	}
}

export const setCurrentWorkingDirectory = implementFunction(
	"setCurrentWorkingDirectory",
	{
		NODE: (path) => DEither.whenIsRightOtherwise(
			DEither.safeCallback(() => void process.chdir(toPlatformPathOrThrow(path))),
			DEither.ok,
			DEither.fail,
		),
		DENO: (path) => DEither.whenIsRightOtherwise(
			DEither.safeCallback(() => void Deno.chdir(toPlatformPathOrThrow(path))),
			DEither.ok,
			DEither.fail,
		),
	},
);
