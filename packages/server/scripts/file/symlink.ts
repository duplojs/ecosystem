import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

export interface SymlinkParams {

	/**
	 * @remarks
	 * Specify the symbolic link type as file, directory or NTFS junction.
	 * This option only applies to Windows and is ignored on other operating systems.
	 */
	type: "file" | "dir" | "junction";
}

class SymlinkErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-symlink-not-found", Error) {}
class SymlinkErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-symlink-permission-denied", Error) {}
class SymlinkErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-symlink-already-exists", Error) {}
class SymlinkErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-symlink-not-directory", Error) {}
class SymlinkErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-symlink-read-only", Error) {}
class SymlinkErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-symlink-invalid-argument", Error) {}
class SymlinkErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-symlink-too-many-open-files", Error) {}
class SymlinkErrorBusy extends DCommon.DuploJSError.parentClass("file-system-symlink-busy", Error) {}
class SymlinkError extends DCommon.DuploJSError.parentClass("file-system-symlink-error", Error) {}

export type SymlinkErrors = (
	| SymlinkErrorNotFound
	| SymlinkErrorPermissionDenied
	| SymlinkErrorAlreadyExists
	| SymlinkErrorNotDirectory
	| SymlinkErrorReadOnly
	| SymlinkErrorInvalidArgument
	| SymlinkErrorTooManyOpenFiles
	| SymlinkErrorBusy
	| SymlinkError
);

export type SymlinkResult = (
	| DEither.Right<"file-system-symlink", void>
	| DEither.Left<"file-system-symlink-error", SymlinkErrors>
);

function handleNodeSymlinkError(error: Error) {
	let symlinkError: SymlinkErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			symlinkError = new SymlinkErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			symlinkError = new SymlinkErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			symlinkError = new SymlinkErrorAlreadyExists(error);
		} else if (error.code === "ENOTDIR") {
			symlinkError = new SymlinkErrorNotDirectory(error);
		} else if (error.code === "EROFS") {
			symlinkError = new SymlinkErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			symlinkError = new SymlinkErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			symlinkError = new SymlinkErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			symlinkError = new SymlinkErrorBusy(error);
		}
	}

	if (symlinkError === undefined) {
		symlinkError = new SymlinkError(error);
	}

	return DEither.left("file-system-symlink-error", symlinkError);
}

function handleDenoSymlinkError(error: Error) {
	let symlinkError: SymlinkErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		symlinkError = new SymlinkErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		symlinkError = new SymlinkErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		symlinkError = new SymlinkErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		symlinkError = new SymlinkErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		symlinkError = new SymlinkErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		symlinkError = new SymlinkErrorBusy(error);
	}

	if (symlinkError === undefined) {
		symlinkError = new SymlinkError(error);
	}

	return DEither.left("file-system-symlink-error", symlinkError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		symlink(
			oldPath: string & DPath.Path,
			newPath: string & DPath.Path,
			params?: SymlinkParams
		): Promise<SymlinkResult>;
	}
}

const symlinkImplementation = implementFunction(
	"symlink",
	{
		NODE: async(oldPath, newPath, params) => {
			const fs = await nodeFileSystem.value;
			return fs.symlink(
				oldPath,
				newPath,
				params?.type,
			)
				.then(() => DEither.right("file-system-symlink"))
				.catch(handleNodeSymlinkError);
		},
		DENO: (oldPath, newPath, params) => Deno
			.symlink(
				oldPath,
				newPath,
				params,
			)
			.then(() => DEither.right("file-system-symlink"))
			.catch(handleDenoSymlinkError),
	},
);

export function symlink(
	newPath: string & DPath.Path,
): (
	oldPath: string & DPath.Path,
) => Promise<SymlinkResult>;

export function symlink(
	oldPath: string & DPath.Path,
	newPath: string & DPath.Path,
	params?: SymlinkParams,
): Promise<SymlinkResult>;

export function symlink(
	...args:
		| [newPath: string & DPath.Path]
		| [oldPath: string & DPath.Path, newPath: string & DPath.Path, params?: SymlinkParams]
) {
	if (args.length === 1) {
		const [newPath] = args;

		return (oldPath: string & DPath.Path) => symlinkImplementation(
			oldPath,
			newPath,
		);
	}

	return symlinkImplementation(...args);
}
