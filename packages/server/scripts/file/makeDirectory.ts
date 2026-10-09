import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

interface MakeDirectoryParams {
	recursive?: boolean;
}

class MakeDirectoryErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-make-directory-not-found", Error) {}
class MakeDirectoryErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-make-directory-permission-denied", Error) {}
class MakeDirectoryErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-make-directory-already-exists", Error) {}
class MakeDirectoryErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-make-directory-not-directory", Error) {}
class MakeDirectoryErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-make-directory-no-space", Error) {}
class MakeDirectoryErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-make-directory-read-only", Error) {}
class MakeDirectoryErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-make-directory-invalid-argument", Error) {}
class MakeDirectoryErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-make-directory-too-many-open-files", Error) {}
class MakeDirectoryErrorBusy extends DCommon.DuploJSError.parentClass("file-system-make-directory-busy", Error) {}
class MakeDirectoryError extends DCommon.DuploJSError.parentClass("file-system-make-directory-error", Error) {}

export type MakeDirectoryErrors = (
	| MakeDirectoryErrorNotFound
	| MakeDirectoryErrorPermissionDenied
	| MakeDirectoryErrorAlreadyExists
	| MakeDirectoryErrorNotDirectory
	| MakeDirectoryErrorNoSpace
	| MakeDirectoryErrorReadOnly
	| MakeDirectoryErrorInvalidArgument
	| MakeDirectoryErrorTooManyOpenFiles
	| MakeDirectoryErrorBusy
	| MakeDirectoryError
);

export type MakeDirectoryResult = (
	| DEither.Right<"file-system-make-directory", void>
	| DEither.Left<"file-system-make-directory-error", MakeDirectoryErrors>
);

function handleNodeMakeDirectoryError(error: Error) {
	let makeDirectoryError: MakeDirectoryErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			makeDirectoryError = new MakeDirectoryErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			makeDirectoryError = new MakeDirectoryErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			makeDirectoryError = new MakeDirectoryErrorAlreadyExists(error);
		} else if (error.code === "ENOTDIR") {
			makeDirectoryError = new MakeDirectoryErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			makeDirectoryError = new MakeDirectoryErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			makeDirectoryError = new MakeDirectoryErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			makeDirectoryError = new MakeDirectoryErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			makeDirectoryError = new MakeDirectoryErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			makeDirectoryError = new MakeDirectoryErrorBusy(error);
		}
	}

	if (makeDirectoryError === undefined) {
		makeDirectoryError = new MakeDirectoryError(error);
	}

	return DEither.left("file-system-make-directory-error", makeDirectoryError);
}

function handleDenoMakeDirectoryError(error: Error) {
	let makeDirectoryError: MakeDirectoryErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		makeDirectoryError = new MakeDirectoryErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		makeDirectoryError = new MakeDirectoryErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		makeDirectoryError = new MakeDirectoryErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		makeDirectoryError = new MakeDirectoryErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		makeDirectoryError = new MakeDirectoryErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		makeDirectoryError = new MakeDirectoryErrorBusy(error);
	}

	if (makeDirectoryError === undefined) {
		makeDirectoryError = new MakeDirectoryError(error);
	}

	return DEither.left("file-system-make-directory-error", makeDirectoryError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		makeDirectory(
			path: string & DPath.Path,
			params?: MakeDirectoryParams
		): Promise<MakeDirectoryResult>;
	}
}

export const makeDirectory = implementFunction(
	"makeDirectory",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;
			return fs.mkdir(
				path,
				{
					recursive: params?.recursive,
				},
			)
				.then(() => DEither.right("file-system-make-directory"))
				.catch(handleNodeMakeDirectoryError);
		},
		DENO: (path, params) => Deno.mkdir(
			path,
			{
				recursive: params?.recursive,
			},
		)
			.then(() => DEither.right("file-system-make-directory"))
			.catch(handleDenoMakeDirectoryError),
	},
);
