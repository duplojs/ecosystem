import { normalizePlatformPathOrThrow } from "../platformPath";
import * as DPath from "@duplojs/lang/path";
import { implementFunction } from "@scripts/implementor";

declare module "@scripts/implementor" {
	interface ServerFunction {
		getCurrentDirectoryName(importMeta: ImportMeta): string & DPath.Absolute;
	}
}

export const getCurrentDirectoryName = implementFunction(
	"getCurrentDirectoryName",
	{
		NODE: (importMeta) => {
			const path = normalizePlatformPathOrThrow(importMeta.dirname);
			if (!DPath.isAbsolute(path)) {
				throw new DPath.CreateAbsolutePathError(importMeta.dirname);
			}
			return path;
		},
	},
);
