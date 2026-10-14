import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		getCurrentDirectoryName(importMeta: ImportMeta): string & DPath.Absolute;
	}
}

export const getCurrentDirectoryName = implementFunction(
	"getCurrentDirectoryName",
	{
		NODE: (importMeta) => DCommon.pipe(
			importMeta.dirname,
			DPath.createAbsoluteOrThrow,
		),
	},
);
