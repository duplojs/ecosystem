import type * as DPath from "@duplojs/lang/path";
import { stat } from "./stat";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import { createFileInterface } from "./fileInterface";
import { createFolderInterface } from "./folderInterface";
import { createUnknownEntryInterface } from "./unknownEntryInterface";

export async function createEntryInterface(path: string & DPath.Path) {
	const result = await DEither.rightAsyncPipe(
		stat(path),
		DPattern.when(
			({ isFile }) => isFile,
			() => DEither.right(
				"file-interface",
				createFileInterface(path),
			),
		),
		DPattern.when(
			({ isDirectory }) => isDirectory,
			() => DEither.right(
				"folder-interface",
				createFolderInterface(path),
			),
		),
		DPattern.otherwise(
			() => DEither.right(
				"unknown-entry-interface",
				createUnknownEntryInterface(path),
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
