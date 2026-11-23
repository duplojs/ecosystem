import * as DSPath from "@scripts/path";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		getCurrentDirectoryName(importMeta: ImportMeta): string & DPath.Absolute;
	}
}

export const getCurrentDirectoryName = implementFunction(
	"getCurrentDirectoryName",
	{
		NODE: (importMeta) => DSPath.createAbsoluteOrThrow(importMeta.dirname),
	},
);
