import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class EnsureDirectoryErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-permission-denied", Error) {}
class EnsureDirectoryErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-not-directory", Error) {}
class EnsureDirectoryErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-no-space", Error) {}
class EnsureDirectoryErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-read-only", Error) {}
class EnsureDirectoryErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-invalid-argument", Error) {}
class EnsureDirectoryErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-too-many-open-files", Error) {}
class EnsureDirectoryErrorBusy extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-busy", Error) {}
class EnsureDirectoryError extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-error", Error) {}

type EnsureDirectoryErrors = (
	| EnsureDirectoryErrorPermissionDenied
	| EnsureDirectoryErrorNotDirectory
	| EnsureDirectoryErrorNoSpace
	| EnsureDirectoryErrorReadOnly
	| EnsureDirectoryErrorInvalidArgument
	| EnsureDirectoryErrorTooManyOpenFiles
	| EnsureDirectoryErrorBusy
	| EnsureDirectoryError
);

export type EnsureDirectoryResult = (
	| DEither.Right<"file-system-ensure-directory", void>
	| DEither.Left<"file-system-ensure-directory-error", EnsureDirectoryErrors>
);

function handleNodeEnsureDirectoryError(error: Error) {
	let ensureDirectoryError: EnsureDirectoryErrors | undefined = undefined;

	if ("code" in error) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			ensureDirectoryError = new EnsureDirectoryErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			ensureDirectoryError = new EnsureDirectoryErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			ensureDirectoryError = new EnsureDirectoryErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			ensureDirectoryError = new EnsureDirectoryErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			ensureDirectoryError = new EnsureDirectoryErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			ensureDirectoryError = new EnsureDirectoryErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			ensureDirectoryError = new EnsureDirectoryErrorBusy(error);
		}
	}

	if (ensureDirectoryError === undefined) {
		ensureDirectoryError = new EnsureDirectoryError(error);
	}

	return DEither.left("file-system-ensure-directory-error", ensureDirectoryError);
}

function handleDenoEnsureDirectoryError(error: Error) {
	let ensureDirectoryError: EnsureDirectoryErrors | undefined = undefined;

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		ensureDirectoryError = new EnsureDirectoryErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		ensureDirectoryError = new EnsureDirectoryErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		ensureDirectoryError = new EnsureDirectoryErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		ensureDirectoryError = new EnsureDirectoryErrorBusy(error);
	}

	if (ensureDirectoryError === undefined) {
		ensureDirectoryError = new EnsureDirectoryError(error);
	}

	return DEither.left("file-system-ensure-directory-error", ensureDirectoryError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		ensureDirectory(path: string & DPath.Path): Promise<EnsureDirectoryResult>;
	}
}

export const ensureDirectory = implementFunction(
	"ensureDirectory",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.mkdir(
				path,
				{
					recursive: true,
				},
			)
				.then(() => DEither.right("file-system-ensure-directory"))
				.catch(handleNodeEnsureDirectoryError);
		},
		DENO: (path) => Deno.mkdir(
			path,
			{
				recursive: true,
			},
		)
			.then(() => DEither.right("file-system-ensure-directory"))
			.catch(handleDenoEnsureDirectoryError),
	},
);
