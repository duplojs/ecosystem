import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

class TruncateErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-truncate-not-found", Error) {}
class TruncateErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-truncate-permission-denied", Error) {}
class TruncateErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-truncate-is-directory", Error) {}
class TruncateErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-truncate-not-directory", Error) {}
class TruncateErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-truncate-no-space", Error) {}
class TruncateErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-truncate-read-only", Error) {}
class TruncateErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-truncate-invalid-argument", Error) {}
class TruncateErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-truncate-too-many-open-files", Error) {}
class TruncateErrorBusy extends DCommon.DuploJSError.parentClass("file-system-truncate-busy", Error) {}
class TruncateError extends DCommon.DuploJSError.parentClass("file-system-truncate-error", Error) {}

export type TruncateErrors = (
	| TruncateErrorNotFound
	| TruncateErrorPermissionDenied
	| TruncateErrorIsDirectory
	| TruncateErrorNotDirectory
	| TruncateErrorNoSpace
	| TruncateErrorReadOnly
	| TruncateErrorInvalidArgument
	| TruncateErrorTooManyOpenFiles
	| TruncateErrorBusy
	| TruncateError
);

export type TruncateResult = (
	| DEither.Right<"file-system-truncate", void>
	| DEither.Left<"file-system-truncate-error", TruncateErrors>
);

function handleNodeTruncateError(error: Error) {
	let truncateError: TruncateErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			truncateError = new TruncateErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			truncateError = new TruncateErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			truncateError = new TruncateErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			truncateError = new TruncateErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			truncateError = new TruncateErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			truncateError = new TruncateErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			truncateError = new TruncateErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			truncateError = new TruncateErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			truncateError = new TruncateErrorBusy(error);
		}
	}

	if (truncateError === undefined) {
		truncateError = new TruncateError(error);
	}

	return DEither.left("file-system-truncate-error", truncateError);
}

function handleDenoTruncateError(error: Error) {
	let truncateError: TruncateErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		truncateError = new TruncateErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		truncateError = new TruncateErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		truncateError = new TruncateErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		truncateError = new TruncateErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		truncateError = new TruncateErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		truncateError = new TruncateErrorBusy(error);
	}

	if (truncateError === undefined) {
		truncateError = new TruncateError(error);
	}

	return DEither.left("file-system-truncate-error", truncateError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		truncate(
			path: string & DPath.Path,
			size?: number,
		): Promise<TruncateResult>;
	}
}

export const truncate = implementFunction(
	"truncate",
	{
		NODE: async(path, size) => {
			const fs = await nodeFileSystem.value;
			return fs.truncate(path, size)
				.then(() => DEither.right("file-system-truncate"))
				.catch(handleNodeTruncateError);
		},
		DENO: (path, size) => DCommon.pipe(
			path,
			DCommon.when(
				DCommon.instanceOf(URL),
				({ pathname }) => decodeURIComponent(pathname),
			),
			(stringPath) => Deno
				.truncate(stringPath, size)
				.then(() => DEither.right("file-system-truncate"))
				.catch(handleDenoTruncateError),
		),
	},
);
