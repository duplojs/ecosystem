import * as DPath from "@duplojs/lang/path";
import type * as DEither from "@duplojs/lang/either";
import { implementFunction } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

declare module "@scripts/implementor" {
	interface ServerFunction {
		getCurrentDirectoryName(importMeta: ImportMeta): (
			| DEither.Error<string>
			| DEither.Success<string & DPath.Absolute>
		);
	}
}

export const getCurrentDirectoryName = implementFunction(
	"getCurrentDirectoryName",
	{
		NODE: (importMeta) => DCommon.pipe(
			importMeta.dirname,
			DPath.createAbsolute,
		),
	},
);
