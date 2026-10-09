import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

class ReadJsonFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-read-json-file-not-found", Error) {}
class ReadJsonFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-json-file-permission-denied", Error) {}
class ReadJsonFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-read-json-file-is-directory", Error) {}
class ReadJsonFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-read-json-file-not-directory", Error) {}
class ReadJsonFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-read-json-file-too-many-open-files", Error) {}
class ReadJsonFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-read-json-file-busy", Error) {}
class ReadJsonFileError extends DCommon.DuploJSError.parentClass("file-system-read-json-file-error", Error) {}

type ReadJsonFileErrors = (
	| ReadJsonFileErrorNotFound
	| ReadJsonFileErrorPermissionDenied
	| ReadJsonFileErrorIsDirectory
	| ReadJsonFileErrorNotDirectory
	| ReadJsonFileErrorTooManyOpenFiles
	| ReadJsonFileErrorBusy
	| ReadJsonFileError
);

export type ReadJsonFileResult = (
	| DEither.Right<"file-system-read-json-file", DCommon.Json>
	| DEither.Left<"file-system-read-json-file-error", ReadJsonFileErrors>
);

function handleNodeReadJsonFileError(error: Error) {
	let readJsonFileError: ReadJsonFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			readJsonFileError = new ReadJsonFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			readJsonFileError = new ReadJsonFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			readJsonFileError = new ReadJsonFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			readJsonFileError = new ReadJsonFileErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			readJsonFileError = new ReadJsonFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			readJsonFileError = new ReadJsonFileErrorBusy(error);
		}
	}

	if (readJsonFileError === undefined) {
		readJsonFileError = new ReadJsonFileError(error);
	}

	return DEither.left("file-system-read-json-file-error", readJsonFileError);
}

function handleDenoReadJsonFileError(error: Error) {
	let readJsonFileError: ReadJsonFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		readJsonFileError = new ReadJsonFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		readJsonFileError = new ReadJsonFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		readJsonFileError = new ReadJsonFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		readJsonFileError = new ReadJsonFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.Busy) {
		readJsonFileError = new ReadJsonFileErrorBusy(error);
	}

	if (readJsonFileError === undefined) {
		readJsonFileError = new ReadJsonFileError(error);
	}

	return DEither.left("file-system-read-json-file-error", readJsonFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readJsonFile(path: string & DPath.Path): Promise<ReadJsonFileResult>;
	}
}

export const readJsonFile = implementFunction(
	"readJsonFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readFile(path, { encoding: "utf-8" })
				.then(JSON.parse)
				.then((value) => DEither.right("file-system-read-json-file", value))
				.catch(handleNodeReadJsonFileError);
		},

		DENO: (path) => Deno.readTextFile(path)
			.then(JSON.parse)
			.then((value) => DEither.right("file-system-read-json-file", value))
			.catch(handleDenoReadJsonFileError),

		BUN: (path) => Bun.file(path)
			.text()
			.then(JSON.parse)
			.then((value) => DEither.right("file-system-read-json-file", value))
			.catch(handleNodeReadJsonFileError),
	},
);
