import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { findPackageJSON } from "node:module";

export const skillsPath = DCommon.pipe(
	DEither.rightPipe(
		findPackageJSON(".", import.meta.url),
		DEither.toMaybe,
		DPath.create,
		DPath.getParentFolderPath,
		DEither.toMaybe,
		(path) => DPath.resolveRelative([path, DCommon.cast("skills")]),
	),
	DEither.whenIsLeft((cause) => {
		throw new Error("@duplojs/agents-kit path was not found.", { cause });
	}),
	DEither.unwrapRight,
);
