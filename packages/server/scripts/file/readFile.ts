import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class ReadFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-read-file-not-found", Error) {}
class ReadFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-file-permission-denied", Error) {}
class ReadFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-read-file-is-directory", Error) {}
class ReadFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-read-file-not-directory", Error) {}
class ReadFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-read-file-too-many-open-files", Error) {}
class ReadFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-read-file-busy", Error) {}
class ReadFileError extends DCommon.DuploJSError.parentClass("file-system-read-file-error", Error) {}

type ReadFileErrors = (
	| ReadFileErrorNotFound
	| ReadFileErrorPermissionDenied
	| ReadFileErrorIsDirectory
	| ReadFileErrorNotDirectory
	| ReadFileErrorTooManyOpenFiles
	| ReadFileErrorBusy
	| ReadFileError
);

export type ReadFileResult = (
	| DEither.Right<"file-system-read-file", Uint8Array>
	| DEither.Left<"file-system-read-file-error", ReadFileErrors>
);

function handleNodeReadFileError(error: Error) {
	let readFileError: ReadFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			readFileError = new ReadFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			readFileError = new ReadFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			readFileError = new ReadFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			readFileError = new ReadFileErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			readFileError = new ReadFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			readFileError = new ReadFileErrorBusy(error);
		}
	}

	if (readFileError === undefined) {
		readFileError = new ReadFileError(error);
	}

	return DEither.left("file-system-read-file-error", readFileError);
}

function handleDenoReadFileError(error: Error) {
	let readFileError: ReadFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		readFileError = new ReadFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		readFileError = new ReadFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		readFileError = new ReadFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		readFileError = new ReadFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.Busy) {
		readFileError = new ReadFileErrorBusy(error);
	}

	if (readFileError === undefined) {
		readFileError = new ReadFileError(error);
	}

	return DEither.left("file-system-read-file-error", readFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readFile(path: string & DPath.Path): Promise<ReadFileResult>;
	}
}

export const readFile = implementFunction(
	"readFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readFile(path)
				.then((value) => DEither.right("file-system-read-file", value))
				.catch(handleNodeReadFileError);
		},
		DENO: (path) => Deno
			.readFile(path)
			.then((value) => DEither.right("file-system-read-file", value))
			.catch(handleDenoReadFileError),
		BUN: (path) => Bun.file(path)
			.bytes()
			.then((value) => DEither.right("file-system-read-file", value))
			.catch(handleNodeReadFileError),
	},
);
