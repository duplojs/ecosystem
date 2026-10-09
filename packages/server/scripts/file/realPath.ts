import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

class RealPathErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-real-path-not-found", Error) {}
class RealPathErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-real-path-permission-denied", Error) {}
class RealPathErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-real-path-not-directory", Error) {}
class RealPathErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-real-path-too-many-open-files", Error) {}
class RealPathError extends DCommon.DuploJSError.parentClass("file-system-real-path-error", Error) {}

export type RealPathErrors = (
	| RealPathErrorNotFound
	| RealPathErrorPermissionDenied
	| RealPathErrorNotDirectory
	| RealPathErrorTooManyOpenFiles
	| RealPathError
);

export type RealPathResult = (
	| DEither.Right<"file-system-real-path", string>
	| DEither.Left<"file-system-real-path-error", RealPathErrors>
);

function handleNodeRealPathError(error: Error) {
	let realPathError: RealPathErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			realPathError = new RealPathErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			realPathError = new RealPathErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			realPathError = new RealPathErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			realPathError = new RealPathErrorTooManyOpenFiles(error);
		}
	}

	if (realPathError === undefined) {
		realPathError = new RealPathError(error);
	}

	return DEither.left("file-system-real-path-error", realPathError);
}

function handleDenoRealPathError(error: Error) {
	let realPathError: RealPathErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		realPathError = new RealPathErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		realPathError = new RealPathErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		realPathError = new RealPathErrorNotDirectory(error);
	}

	if (realPathError === undefined) {
		realPathError = new RealPathError(error);
	}

	return DEither.left("file-system-real-path-error", realPathError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		realPath(
			path: string & DPath.Path,
		): Promise<RealPathResult>;
	}
}

export const realPath = implementFunction(
	"realPath",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.realpath(path)
				.then((value) => DEither.right("file-system-real-path", value))
				.catch(handleNodeRealPathError);
		},
		DENO: (path) => Deno
			.realPath(path)
			.then((value) => DEither.right("file-system-real-path", value))
			.catch(handleDenoRealPathError),
	},
);
