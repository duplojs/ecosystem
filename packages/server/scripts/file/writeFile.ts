import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

class WriteFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-write-file-not-found", Error) {}
class WriteFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-write-file-permission-denied", Error) {}
class WriteFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-write-file-is-directory", Error) {}
class WriteFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-write-file-not-directory", Error) {}
class WriteFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-write-file-no-space", Error) {}
class WriteFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-write-file-read-only", Error) {}
class WriteFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-write-file-invalid-argument", Error) {}
class WriteFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-write-file-too-many-open-files", Error) {}
class WriteFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-write-file-busy", Error) {}
class WriteFileError extends DCommon.DuploJSError.parentClass("file-system-write-file-error", Error) {}

export type WriteFileErrors = (
	| WriteFileErrorNotFound
	| WriteFileErrorPermissionDenied
	| WriteFileErrorIsDirectory
	| WriteFileErrorNotDirectory
	| WriteFileErrorNoSpace
	| WriteFileErrorReadOnly
	| WriteFileErrorInvalidArgument
	| WriteFileErrorTooManyOpenFiles
	| WriteFileErrorBusy
	| WriteFileError
);

export type WriteFileResult = (
	| DEither.Right<"file-system-write-file", void>
	| DEither.Left<"file-system-write-file-error", WriteFileErrors>
);

function handleNodeWriteFileError(error: Error) {
	let writeFileError: WriteFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			writeFileError = new WriteFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			writeFileError = new WriteFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			writeFileError = new WriteFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			writeFileError = new WriteFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			writeFileError = new WriteFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			writeFileError = new WriteFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			writeFileError = new WriteFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			writeFileError = new WriteFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			writeFileError = new WriteFileErrorBusy(error);
		}
	}

	if (writeFileError === undefined) {
		writeFileError = new WriteFileError(error);
	}

	return DEither.left("file-system-write-file-error", writeFileError);
}

function handleDenoWriteFileError(error: Error) {
	let writeFileError: WriteFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		writeFileError = new WriteFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		writeFileError = new WriteFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		writeFileError = new WriteFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		writeFileError = new WriteFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		writeFileError = new WriteFileErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		writeFileError = new WriteFileErrorBusy(error);
	}

	if (writeFileError === undefined) {
		writeFileError = new WriteFileError(error);
	}

	return DEither.left("file-system-write-file-error", writeFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		writeFile(
			path: string & DPath.Path,
			data: Uint8Array,
		): Promise<WriteFileResult>;
	}
}

const writeFileImplementation = implementFunction(
	"writeFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.writeFile(
				path,
				data,
			)
				.then(() => DEither.right("file-system-write-file"))
				.catch(handleNodeWriteFileError);
		},
		DENO: (path, data) => Deno
			.writeFile(
				path,
				data,
			)
			.then(() => DEither.right("file-system-write-file"))
			.catch(handleDenoWriteFileError),
		BUN: (path, data) => Bun
			.file(path)
			.write(data)
			.then(() => DEither.right("file-system-write-file"))
			.catch(handleNodeWriteFileError),
	},
);

export function writeFile(
	data: Uint8Array,
): (
	path: string & DPath.Path,
) => Promise<WriteFileResult>;

export function writeFile(
	path: string & DPath.Path,
	data: Uint8Array,
): Promise<WriteFileResult>;

export function writeFile(
	...args:
		| [data: Uint8Array]
		| [path: string & DPath.Path, data: Uint8Array]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => writeFileImplementation(
			path,
			data,
		);
	}

	return writeFileImplementation(...args);
}
