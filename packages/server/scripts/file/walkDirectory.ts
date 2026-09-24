import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DGenerator from "@duplojs/lang/generator";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import { type FileInterface, createFileInterface } from "./fileInterface";
import { type FolderInterface, createFolderInterface } from "./folderInterface";
import { createUnknownInterface, type UnknownInterface } from "./unknownInterface";
import type { FileSystemEither } from "./types";

interface WalkDirectoryParams {
	recursive?: boolean;
}

export type WalkDirectoryResult = FileSystemEither<
	| DEither.Right<"walk-directory", Generator<FileInterface | FolderInterface | UnknownInterface>>
	| DEither.Left<"walk-directory-not-found", unknown>
	| DEither.Left<"walk-directory-permission-denied", unknown>
	| DEither.Left<"walk-directory-not-directory", unknown>
	| DEither.Left<"walk-directory-too-many-open-files", unknown>
	| DEither.Left<"walk-directory-busy", unknown>
	| DEither.Left<"walk-directory-error", unknown>
>;

function handleNodeWalkDirectoryError(error: unknown): WalkDirectoryResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-walk-directory-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-walk-directory-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-walk-directory-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-walk-directory-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-walk-directory-busy", error);
		}
	}

	return DEither.left("file-system-walk-directory-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		walkDirectory(
			path: string & DPath.Path,
			params?: WalkDirectoryParams,
		): Promise<WalkDirectoryResult>;
	}
}

export const walkDirectory = implementFunction(
	"walkDirectory",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;

			return fs.readdir(
				path,
				{
					recursive: params?.recursive ?? false,
					withFileTypes: true,
				},
			)
				.then(
					DCommon.innerPipe(
						DGenerator.map(
							DCommon.innerPipe(
								DPattern.when(
									(dirent) => dirent.isFile(),
									({ parentPath, name }) => createFileInterface(
										DCommon.forwardAsserts(`${parentPath}/${name}`, DPath.is),
									),
								),
								DPattern.when(
									(dirent) => dirent.isDirectory(),
									({ parentPath, name }) => createFolderInterface(
										DCommon.forwardAsserts(`${parentPath}/${name}`, DPath.is),
									),
								),
								DPattern.otherwise(
									({ parentPath, name }) => createUnknownInterface(
										DCommon.forwardAsserts(`${parentPath}/${name}`, DPath.is),
									),
								),
							),
						),
						(value) => DEither.right("file-system-walk-directory", value),
					),
				)
				.catch(handleNodeWalkDirectoryError);
		},
	},
);
