import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class MakeTemporaryDirectoryErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-permission-denied", Error) {}
class MakeTemporaryDirectoryErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-not-directory", Error) {}
class MakeTemporaryDirectoryErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-no-space", Error) {}
class MakeTemporaryDirectoryErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-read-only", Error) {}
class MakeTemporaryDirectoryErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-invalid-argument", Error) {}
class MakeTemporaryDirectoryErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-too-many-open-files", Error) {}
class MakeTemporaryDirectoryError extends DCommon.DuploJSError.parentClass("file-system-make-temporary-directory-error", Error) {}

type MakeTemporaryDirectoryErrors = (
	| MakeTemporaryDirectoryErrorPermissionDenied
	| MakeTemporaryDirectoryErrorNotDirectory
	| MakeTemporaryDirectoryErrorNoSpace
	| MakeTemporaryDirectoryErrorReadOnly
	| MakeTemporaryDirectoryErrorInvalidArgument
	| MakeTemporaryDirectoryErrorTooManyOpenFiles
	| MakeTemporaryDirectoryError
);

export type MakeTemporaryDirectoryResult = (
	| DEither.Right<"file-system-make-temporary-directory", string>
	| DEither.Left<"file-system-make-temporary-directory-error", MakeTemporaryDirectoryErrors>
);

function handleNodeMakeTemporaryDirectoryError(error: Error) {
	let makeTemporaryDirectoryError: MakeTemporaryDirectoryErrors | undefined = undefined;

	if ("code" in error) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorTooManyOpenFiles(error);
		}
	}

	if (makeTemporaryDirectoryError === undefined) {
		makeTemporaryDirectoryError = new MakeTemporaryDirectoryError(error);
	}

	return DEither.left("file-system-make-temporary-directory-error", makeTemporaryDirectoryError);
}

function handleDenoMakeTemporaryDirectoryError(error: Error) {
	let makeTemporaryDirectoryError: MakeTemporaryDirectoryErrors | undefined = undefined;

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		makeTemporaryDirectoryError = new MakeTemporaryDirectoryErrorInvalidArgument(error);
	}

	if (makeTemporaryDirectoryError === undefined) {
		makeTemporaryDirectoryError = new MakeTemporaryDirectoryError(error);
	}

	return DEither.left("file-system-make-temporary-directory-error", makeTemporaryDirectoryError);
}
declare module "@scripts/implementor" {
	interface ServerFunction {
		makeTemporaryDirectory(prefix: string): Promise<MakeTemporaryDirectoryResult>;
	}
}

export const makeTemporaryDirectory = implementFunction(
	"makeTemporaryDirectory",
	{
		NODE: async(prefix) => {
			const fs = await nodeFileSystem.value;
			return fs.mkdtemp(prefix)
				.then((value) => DEither.right("file-system-make-temporary-directory", value))
				.catch(handleNodeMakeTemporaryDirectoryError);
		},
		DENO: (prefix) => Deno.makeTempDir({ prefix })
			.then((value) => DEither.right("file-system-make-temporary-directory", value))
			.catch(handleDenoMakeTemporaryDirectoryError),
	},
);
