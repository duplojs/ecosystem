import type * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import { stat } from "./stat";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import { createFileInterface } from "./fileInterface";
import { createFolderInterface } from "./folderInterface";
import { createUnknownEntryInterface } from "./unknownEntryInterface";

export async function createEntryInterface(path: DPath.AnyPath) {
	const entryPath = DCommon.cast(path) satisfies string & DPath.Path;
	const result = await DEither.rightAsyncPipe(
		stat(path),
		DPattern.when(
			({ isFile }) => isFile,
			() => DEither.right(
				"file-interface",
				createFileInterface(entryPath),
			),
		),
		DPattern.when(
			({ isDirectory }) => isDirectory,
			() => DEither.right(
				"folder-interface",
				createFolderInterface(entryPath),
			),
		),
		DPattern.otherwise(
			() => DEither.right(
				"unknown-entry-interface",
				createUnknownEntryInterface(entryPath),
			),
		),
	);

	return DEither.whenIsLeft(
		result,
		(value) => DEither.left(
			"create-entry-interface-error",
			value,
		),
	);
}
