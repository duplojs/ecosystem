import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DPattern from "@duplojs/lang/pattern";
import { resolve } from "path";
import { getCurrentWorkDirectoryOrThrow } from "@scripts/common";

class ReadDirectoryErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-read-directory-not-found", Error) {}
class ReadDirectoryErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-directory-permission-denied", Error) {}
class ReadDirectoryErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-read-directory-not-directory", Error) {}
class ReadDirectoryErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-read-directory-too-many-open-files", Error) {}
class ReadDirectoryErrorBusy extends DCommon.DuploJSError.parentClass("file-system-read-directory-busy", Error) {}
class ReadDirectoryError extends DCommon.DuploJSError.parentClass("file-system-read-directory-error", Error) {}

export type ReadDirectoryErrors = (
	| ReadDirectoryErrorNotFound
	| ReadDirectoryErrorPermissionDenied
	| ReadDirectoryErrorNotDirectory
	| ReadDirectoryErrorTooManyOpenFiles
	| ReadDirectoryErrorBusy
	| ReadDirectoryError
);

function handleNodeReadDirectoryError(error: Error) {
	let readDirectoryError: ReadDirectoryErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			readDirectoryError = new ReadDirectoryErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			readDirectoryError = new ReadDirectoryErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			readDirectoryError = new ReadDirectoryErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			readDirectoryError = new ReadDirectoryErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			readDirectoryError = new ReadDirectoryErrorBusy(error);
		}
	}

	if (readDirectoryError === undefined) {
		readDirectoryError = new ReadDirectoryError(error);
	}

	return DEither.left("file-system-read-directory-error", readDirectoryError);
}

type PathMode = "absolute" | "default" | "assembled";

interface ReadDirectoryParams<
	GenericPathMode extends PathMode = PathMode,
> {
	recursive?: boolean;
	pathMode?: GenericPathMode;
}

export type ReadDirectoryResult<
	GenericPathMode extends PathMode = PathMode,
> = (
	| DEither.Right<
		"file-system-read-directory",
		readonly (
			& string
			& DPath.Path
			& (
				GenericPathMode extends "absolute"
					? DPath.Absolute
					: unknown
			)
		)[]
	>
	| DEither.Left<"file-system-read-directory-error", ReadDirectoryErrors>
);

declare module "@scripts/implementor" {
	interface ServerFunction {
		readDirectory<
			GenericPathMode extends PathMode = "default",
		>(
			path: string & DPath.Path,
			params?: ReadDirectoryParams<GenericPathMode>,
		): Promise<
			ReadDirectoryResult<GenericPathMode>
		>;
	}
}

export const readDirectory = implementFunction(
	"readDirectory",
	{
		NODE: (path, params) => {
			const result = DPattern.matchWithString(
				DCommon.forward<PathMode>(params?.pathMode ?? "default"),
				{
					absolute: () => nodeFileSystem.value.readdir(
						path,
						{
							recursive: params?.recursive,
							withFileTypes: true,
						},
					).then(
						(value) => DEither.right(
							"file-system-read-directory",
							DArray.map(
								value,
								({ name, parentPath }) => DPath.resolveFrom(
									getCurrentWorkDirectoryOrThrow(),
									[DPath.normalize(`${parentPath}/${name}`)!],
								),
							),
						),
					),
					assembled: () => nodeFileSystem.value.readdir(
						path,
						{ recursive: params?.recursive },
					).then(
						(value) => DEither.right(
							"file-system-read-directory",
							DArray.map(
								value,
								(subPath) => (DPath.normalize(`${path}/${subPath}`)!),
							),
						),
					),
					default: () => nodeFileSystem.value.readdir(
						path,
						{ recursive: params?.recursive },
					).then(
						(value) => DEither.right(
							"file-system-read-directory",
							DArray.map(
								value,
								(subPath) => DPath.normalize(subPath)!,
							),
						),
					),
				},
			).catch(handleNodeReadDirectoryError);

			return result as never;
		},
	},
);
