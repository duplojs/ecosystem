import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

interface ReadDirectoryParams {
	recursive?: boolean;
}

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

export type ReadDirectoryResult = (
	| DEither.Right<"file-system-read-directory", (string & DPath.Path)[]>
	| DEither.Left<"file-system-read-directory-error", ReadDirectoryErrors>
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

declare module "@scripts/implementor" {
	interface ServerFunction {
		readDirectory(
			path: string & DPath.Path,
			params?: ReadDirectoryParams,
		): Promise<ReadDirectoryResult>;
	}
}

export const readDirectory = implementFunction(
	"readDirectory",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;

			return fs.readdir(path, { recursive: params?.recursive })
				.then((value) => DEither.right("file-system-read-directory", value as (string & DPath.Path)[]))
				.catch(handleNodeReadDirectoryError);
		},
	},
);
