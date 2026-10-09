import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class EnsureFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-ensure-file-permission-denied", Error) {}
class EnsureFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-ensure-file-is-directory", Error) {}
class EnsureFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-ensure-file-not-directory", Error) {}
class EnsureFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-ensure-file-no-space", Error) {}
class EnsureFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-ensure-file-read-only", Error) {}
class EnsureFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-ensure-file-invalid-argument", Error) {}
class EnsureFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-ensure-file-too-many-open-files", Error) {}
class EnsureFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-ensure-file-busy", Error) {}
class EnsureFileError extends DCommon.DuploJSError.parentClass("file-system-ensure-file-error", Error) {}

type EnsureFileErrors = (
	| EnsureFileErrorPermissionDenied
	| EnsureFileErrorIsDirectory
	| EnsureFileErrorNotDirectory
	| EnsureFileErrorNoSpace
	| EnsureFileErrorReadOnly
	| EnsureFileErrorInvalidArgument
	| EnsureFileErrorTooManyOpenFiles
	| EnsureFileErrorBusy
	| EnsureFileError
);

export type EnsureFileResult = (
	| DEither.Right<"file-system-ensure-file", void>
	| DEither.Left<"file-system-ensure-file-error", EnsureFileErrors>
);

function handleNodeEnsureFileError(error: Error) {
	let ensureFileError: EnsureFileErrors | undefined = undefined;

	if ("code" in error) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			ensureFileError = new EnsureFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			ensureFileError = new EnsureFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			ensureFileError = new EnsureFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			ensureFileError = new EnsureFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			ensureFileError = new EnsureFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			ensureFileError = new EnsureFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			ensureFileError = new EnsureFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			ensureFileError = new EnsureFileErrorBusy(error);
		}
	}

	if (ensureFileError === undefined) {
		ensureFileError = new EnsureFileError(error);
	}

	return DEither.left("file-system-ensure-file-error", ensureFileError);
}

function handleDenoEnsureFileError(error: Error) {
	let ensureFileError: EnsureFileErrors | undefined = undefined;

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		ensureFileError = new EnsureFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		ensureFileError = new EnsureFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		ensureFileError = new EnsureFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		ensureFileError = new EnsureFileErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		ensureFileError = new EnsureFileErrorBusy(error);
	}

	if (ensureFileError === undefined) {
		ensureFileError = new EnsureFileError(error);
	}

	return DEither.left("file-system-ensure-file-error", ensureFileError);
}
declare module "@scripts/implementor" {
	interface ServerFunction {
		ensureFile(path: string & DPath.Path): Promise<EnsureFileResult>;
	}
}

export const ensureFile = implementFunction(
	"ensureFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;

			return fs.open(path, "a")
				.then((fh) => fh.close())
				.then(() => DEither.right("file-system-ensure-file"))
				.catch(handleNodeEnsureFileError);
		},
		DENO: (path) => Deno.open(path, {
			write: true,
			create: true,
			append: true,
		})
			.then((fh) => void fh.close())
			.then(() => DEither.right("file-system-ensure-file"))
			.catch(handleDenoEnsureFileError),
	},
);
