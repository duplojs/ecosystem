import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

interface RemoveDirectoryParams {
	recursive?: boolean;
}

class RemoveErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-remove-not-found", Error) {}
class RemoveErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-remove-permission-denied", Error) {}
class RemoveErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-remove-is-directory", Error) {}
class RemoveErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-remove-not-directory", Error) {}
class RemoveErrorDirectoryNotEmpty extends DCommon.DuploJSError.parentClass("file-system-remove-directory-not-empty", Error) {}
class RemoveErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-remove-read-only", Error) {}
class RemoveErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-remove-invalid-argument", Error) {}
class RemoveErrorBusy extends DCommon.DuploJSError.parentClass("file-system-remove-busy", Error) {}
class RemoveError extends DCommon.DuploJSError.parentClass("file-system-remove-error", Error) {}

export type RemoveErrors = (
	| RemoveErrorNotFound
	| RemoveErrorPermissionDenied
	| RemoveErrorIsDirectory
	| RemoveErrorNotDirectory
	| RemoveErrorDirectoryNotEmpty
	| RemoveErrorReadOnly
	| RemoveErrorInvalidArgument
	| RemoveErrorBusy
	| RemoveError
);

export type RemoveResult = (
	| DEither.Right<"file-system-remove", void>
	| DEither.Left<"file-system-remove-error", RemoveErrors>
);

function handleNodeRemoveError(error: Error) {
	let removeError: RemoveErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			removeError = new RemoveErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			removeError = new RemoveErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			removeError = new RemoveErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			removeError = new RemoveErrorNotDirectory(error);
		} else if (error.code === "ENOTEMPTY") {
			removeError = new RemoveErrorDirectoryNotEmpty(error);
		} else if (error.code === "EROFS") {
			removeError = new RemoveErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			removeError = new RemoveErrorInvalidArgument(error);
		} else if (error.code === "EBUSY") {
			removeError = new RemoveErrorBusy(error);
		}
	}

	if (removeError === undefined) {
		removeError = new RemoveError(error);
	}

	return DEither.left("file-system-remove-error", removeError);
}

function handleDenoRemoveError(error: Error) {
	let removeError: RemoveErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		removeError = new RemoveErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		removeError = new RemoveErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		removeError = new RemoveErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		removeError = new RemoveErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		removeError = new RemoveErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		removeError = new RemoveErrorBusy(error);
	}

	if (removeError === undefined) {
		removeError = new RemoveError(error);
	}

	return DEither.left("file-system-remove-error", removeError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		remove(
			path: string & DPath.Path,
			params?: RemoveDirectoryParams
		): Promise<RemoveResult>;
	}
}

export const remove = implementFunction(
	"remove",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;
			return fs.rm(
				path,
				{
					recursive: params?.recursive ?? false,
					force: true,
				},
			)
				.then(() => DEither.right("file-system-remove"))
				.catch(handleNodeRemoveError);
		},
		DENO: (path, params) => Deno.remove(
			path,
			{
				recursive: params?.recursive,
			},
		)
			.then(() => DEither.right("file-system-remove"))
			.catch(handleDenoRemoveError),
	},
);
