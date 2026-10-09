import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class AppendFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-append-file-not-found", Error) {}
class AppendFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-append-file-permission-denied", Error) {}
class AppendFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-append-file-is-directory", Error) {}
class AppendFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-append-file-not-directory", Error) {}
class AppendFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-append-file-no-space", Error) {}
class AppendFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-append-file-read-only", Error) {}
class AppendFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-append-file-invalid-argument", Error) {}
class AppendFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-append-file-too-many-open-files", Error) {}
class AppendFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-append-file-busy", Error) {}
class AppendFileError extends DCommon.DuploJSError.parentClass("file-system-append-file-error", Error) {}

export type AppendFileErrors = (
	| AppendFileErrorNotFound
	| AppendFileErrorPermissionDenied
	| AppendFileErrorIsDirectory
	| AppendFileErrorNotDirectory
	| AppendFileErrorNoSpace
	| AppendFileErrorReadOnly
	| AppendFileErrorInvalidArgument
	| AppendFileErrorTooManyOpenFiles
	| AppendFileErrorBusy
	| AppendFileError
);

export type AppendFileResult = (
	| DEither.Right<"file-system-append-file", void>
	| DEither.Left<"file-system-append-file-error", AppendFileErrors>
);

function handleNodeAppendFileError(error: Error) {
	let appendFileError: AppendFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			appendFileError = new AppendFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			appendFileError = new AppendFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			appendFileError = new AppendFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			appendFileError = new AppendFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			appendFileError = new AppendFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			appendFileError = new AppendFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			appendFileError = new AppendFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			appendFileError = new AppendFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			appendFileError = new AppendFileErrorBusy(error);
		} else {
			appendFileError = new AppendFileError(error);
		}
	} else {
		appendFileError = new AppendFileError(error);
	}

	return DEither.left("file-system-append-file-error", appendFileError);
}

function handleDenoAppendFileError(error: Error) {
	let appendFileError: AppendFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		appendFileError = new AppendFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		appendFileError = new AppendFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		appendFileError = new AppendFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		appendFileError = new AppendFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		appendFileError = new AppendFileErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		appendFileError = new AppendFileErrorBusy(error);
	} else {
		appendFileError = new AppendFileError(error);
	}

	return DEither.left("file-system-append-file-error", appendFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		appendFile(
			path: string & DPath.Path,
			data: Uint8Array,
		): Promise<AppendFileResult>;
	}
}

const appendFileImplementation = implementFunction(
	"appendFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.appendFile(
				path,
				data,
			)
				.then(() => DEither.right("file-system-append-file"))
				.catch(handleNodeAppendFileError);
		},
		DENO: (path, data) => Deno.writeFile(
			path,
			data,
			{ append: true },
		)
			.then(() => DEither.right("file-system-append-file"))
			.catch(handleDenoAppendFileError),
	},
);

export function appendFile(
	data: Uint8Array,
): (
	path: string & DPath.Path,
) => Promise<AppendFileResult>;

export function appendFile(
	path: string & DPath.Path,
	data: Uint8Array,
): Promise<AppendFileResult>;

export function appendFile(
	...args:
		| [data: Uint8Array]
		| [path: string & DPath.Path, data: Uint8Array]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => appendFileImplementation(
			path,
			data,
		);
	}

	return appendFileImplementation(...args);
}
