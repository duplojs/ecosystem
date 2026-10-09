import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

class ReadTextFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-read-text-file-not-found", Error) {}
class ReadTextFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-text-file-permission-denied", Error) {}
class ReadTextFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-read-text-file-is-directory", Error) {}
class ReadTextFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-read-text-file-not-directory", Error) {}
class ReadTextFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-read-text-file-too-many-open-files", Error) {}
class ReadTextFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-read-text-file-busy", Error) {}
class ReadTextFileError extends DCommon.DuploJSError.parentClass("file-system-read-text-file-error", Error) {}

type ReadTextFileErrors = (
	| ReadTextFileErrorNotFound
	| ReadTextFileErrorPermissionDenied
	| ReadTextFileErrorIsDirectory
	| ReadTextFileErrorNotDirectory
	| ReadTextFileErrorTooManyOpenFiles
	| ReadTextFileErrorBusy
	| ReadTextFileError
);

export type ReadTextFileResult = (
	| DEither.Right<"file-system-read-text-file", string>
	| DEither.Left<"file-system-read-text-file-error", ReadTextFileErrors>
);

function handleNodeReadTextFileError(error: Error) {
	let readTextFileError: ReadTextFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			readTextFileError = new ReadTextFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			readTextFileError = new ReadTextFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			readTextFileError = new ReadTextFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			readTextFileError = new ReadTextFileErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			readTextFileError = new ReadTextFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			readTextFileError = new ReadTextFileErrorBusy(error);
		}
	}

	if (readTextFileError === undefined) {
		readTextFileError = new ReadTextFileError(error);
	}

	return DEither.left("file-system-read-text-file-error", readTextFileError);
}

function handleDenoReadTextFileError(error: Error) {
	let readTextFileError: ReadTextFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		readTextFileError = new ReadTextFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		readTextFileError = new ReadTextFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		readTextFileError = new ReadTextFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		readTextFileError = new ReadTextFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.Busy) {
		readTextFileError = new ReadTextFileErrorBusy(error);
	}

	if (readTextFileError === undefined) {
		readTextFileError = new ReadTextFileError(error);
	}

	return DEither.left("file-system-read-text-file-error", readTextFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readTextFile(path: string & DPath.Path): Promise<ReadTextFileResult>;
	}
}

export const readTextFile = implementFunction(
	"readTextFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readFile(path, { encoding: "utf-8" })
				.then((value) => DEither.right("file-system-read-text-file", value))
				.catch(handleNodeReadTextFileError);
		},
		DENO: (path) => Deno
			.readTextFile(path)
			.then((value) => DEither.right("file-system-read-text-file", value))
			.catch(handleDenoReadTextFileError),
		BUN: (path) => Bun.file(path)
			.text()
			.then((value) => DEither.right("file-system-read-text-file", value))
			.catch(handleNodeReadTextFileError),
	},
);
