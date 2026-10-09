import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

class WriteTextFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-write-text-file-not-found", Error) {}
class WriteTextFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-write-text-file-permission-denied", Error) {}
class WriteTextFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-write-text-file-is-directory", Error) {}
class WriteTextFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-write-text-file-not-directory", Error) {}
class WriteTextFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-write-text-file-no-space", Error) {}
class WriteTextFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-write-text-file-read-only", Error) {}
class WriteTextFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-write-text-file-invalid-argument", Error) {}
class WriteTextFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-write-text-file-too-many-open-files", Error) {}
class WriteTextFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-write-text-file-busy", Error) {}
class WriteTextFileError extends DCommon.DuploJSError.parentClass("file-system-write-text-file-error", Error) {}

export type WriteTextFileErrors = (
	| WriteTextFileErrorNotFound
	| WriteTextFileErrorPermissionDenied
	| WriteTextFileErrorIsDirectory
	| WriteTextFileErrorNotDirectory
	| WriteTextFileErrorNoSpace
	| WriteTextFileErrorReadOnly
	| WriteTextFileErrorInvalidArgument
	| WriteTextFileErrorTooManyOpenFiles
	| WriteTextFileErrorBusy
	| WriteTextFileError
);

export type WriteTextFileResult = (
	| DEither.Right<"file-system-write-text-file", void>
	| DEither.Left<"file-system-write-text-file-error", WriteTextFileErrors>
);

function handleNodeWriteTextFileError(error: Error) {
	let writeTextFileError: WriteTextFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			writeTextFileError = new WriteTextFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			writeTextFileError = new WriteTextFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			writeTextFileError = new WriteTextFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			writeTextFileError = new WriteTextFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			writeTextFileError = new WriteTextFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			writeTextFileError = new WriteTextFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			writeTextFileError = new WriteTextFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			writeTextFileError = new WriteTextFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			writeTextFileError = new WriteTextFileErrorBusy(error);
		}
	}

	if (writeTextFileError === undefined) {
		writeTextFileError = new WriteTextFileError(error);
	}

	return DEither.left("file-system-write-text-file-error", writeTextFileError);
}

function handleDenoWriteTextFileError(error: Error) {
	let writeTextFileError: WriteTextFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		writeTextFileError = new WriteTextFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		writeTextFileError = new WriteTextFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		writeTextFileError = new WriteTextFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		writeTextFileError = new WriteTextFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		writeTextFileError = new WriteTextFileErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		writeTextFileError = new WriteTextFileErrorBusy(error);
	}

	if (writeTextFileError === undefined) {
		writeTextFileError = new WriteTextFileError(error);
	}

	return DEither.left("file-system-write-text-file-error", writeTextFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		writeTextFile(
			path: string & DPath.Path,
			data: string,
		): Promise<WriteTextFileResult>;
	}
}

const writeTextFileImplementation = implementFunction(
	"writeTextFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.writeFile(
				path,
				data,
				{ encoding: "utf-8" },
			)
				.then(() => DEither.right("file-system-write-text-file"))
				.catch(handleNodeWriteTextFileError);
		},
		DENO: (path, data) => Deno
			.writeTextFile(
				path,
				data,
			)
			.then(() => DEither.right("file-system-write-text-file"))
			.catch(handleDenoWriteTextFileError),
		BUN: (path, data) => Bun
			.file(path)
			.write(data)
			.then(() => DEither.right("file-system-write-text-file"))
			.catch(handleNodeWriteTextFileError),
	},
);

export function writeTextFile(
	data: string,
): (
	path: string & DPath.Path,
) => Promise<WriteTextFileResult>;

export function writeTextFile(
	path: string & DPath.Path,
	data: string,
): Promise<WriteTextFileResult>;

export function writeTextFile(
	...args:
		| [data: string]
		| [path: string & DPath.Path, data: string]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => writeTextFileImplementation(
			path,
			data,
		);
	}

	return writeTextFileImplementation(...args);
}
