import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DGenerator from "@duplojs/lang/generator";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import { type FileInterface, createFileInterface } from "./fileInterface";
import { type FolderInterface, createFolderInterface } from "./folderInterface";
import { createUnknownEntryInterface, type UnknownEntryInterface } from "./unknownEntryInterface";
import * as DSCommon from "@scripts/common";

export interface WalkDirectoryParams {
	recursive?: boolean;
	matcher?: DPath.PathMatcher;
}

class WalkDirectoryErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-walk-directory-not-found", Error) {}
class WalkDirectoryErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-walk-directory-permission-denied", Error) {}
class WalkDirectoryErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-walk-directory-not-directory", Error) {}
class WalkDirectoryErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-walk-directory-too-many-open-files", Error) {}
class WalkDirectoryErrorBusy extends DCommon.DuploJSError.parentClass("file-system-walk-directory-busy", Error) {}
class WalkDirectoryError extends DCommon.DuploJSError.parentClass("file-system-walk-directory-error", Error) {}

export type WalkDirectoryErrors = (
	| WalkDirectoryErrorNotFound
	| WalkDirectoryErrorPermissionDenied
	| WalkDirectoryErrorNotDirectory
	| WalkDirectoryErrorTooManyOpenFiles
	| WalkDirectoryErrorBusy
	| WalkDirectoryError
);

export type WalkDirectoryResult = (
	| DEither.Right<
		"file-system-walk-directory",
		Generator<
			| FileInterface<string & DPath.Absolute>
			| FolderInterface<string & DPath.Absolute>
			| UnknownEntryInterface<string & DPath.Absolute>
		>
	>
	| DEither.Left<"file-system-walk-directory-error", WalkDirectoryErrors>
);

function handleNodeWalkDirectoryError(error: Error) {
	let walkDirectoryError: WalkDirectoryErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			walkDirectoryError = new WalkDirectoryErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			walkDirectoryError = new WalkDirectoryErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			walkDirectoryError = new WalkDirectoryErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			walkDirectoryError = new WalkDirectoryErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			walkDirectoryError = new WalkDirectoryErrorBusy(error);
		}
	}

	if (walkDirectoryError === undefined) {
		walkDirectoryError = new WalkDirectoryError(error);
	}

	return DEither.left("file-system-walk-directory-error", walkDirectoryError);
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
		NODE: async(path, params) => nodeFileSystem.value.readdir(
			path,
			{
				recursive: params?.recursive ?? false,
				withFileTypes: true,
			},
		)
			.then(
				(result) => {
					const currentWorkDirectory = DSCommon.getCurrentWorkDirectoryOrThrow();

					return DCommon.pipe(
						result,
						DGenerator.map(
							(dirent) => ({
								dirent,
								path: DPath.resolveFrom(
									currentWorkDirectory,
									[DPath.normalize(`${dirent.parentPath}/${dirent.name}`)!],
								),
							}),
						),
						DGenerator.filter(
							(value) => params?.matcher
								? params?.matcher(DCommon.cast(value.path))
								: true,
						),
						DGenerator.map(
							DCommon.innerPipe(
								DPattern.when(
									({ dirent }) => dirent.isFile(),
									({ path }) => createFileInterface(
										path,
									),
								),
								DPattern.when(
									({ dirent }) => dirent.isDirectory(),
									({ path }) => createFolderInterface(
										path,
									),
								),
								DPattern.otherwise(
									({ path }) => createUnknownEntryInterface(
										path,
									),
								),
							),
						),
						(value) => DEither.right("file-system-walk-directory", value),
					);
				},
			)
			.catch(handleNodeWalkDirectoryError),
	},
);
