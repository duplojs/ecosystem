import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class RenameErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-rename-not-found", Error) {}
class RenameErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-rename-permission-denied", Error) {}
class RenameErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-rename-already-exists", Error) {}
class RenameErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-rename-is-directory", Error) {}
class RenameErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-rename-not-directory", Error) {}
class RenameErrorDirectoryNotEmpty extends DCommon.DuploJSError.parentClass("file-system-rename-directory-not-empty", Error) {}
class RenameErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-rename-read-only", Error) {}
class RenameErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-rename-invalid-argument", Error) {}
class RenameErrorBusy extends DCommon.DuploJSError.parentClass("file-system-rename-busy", Error) {}
class RenameErrorCrossDevice extends DCommon.DuploJSError.parentClass("file-system-rename-cross-device", Error) {}
class RenameError extends DCommon.DuploJSError.parentClass("file-system-rename-error", Error) {}

export type RenameErrors = (
	| RenameErrorNotFound
	| RenameErrorPermissionDenied
	| RenameErrorAlreadyExists
	| RenameErrorIsDirectory
	| RenameErrorNotDirectory
	| RenameErrorDirectoryNotEmpty
	| RenameErrorReadOnly
	| RenameErrorInvalidArgument
	| RenameErrorBusy
	| RenameErrorCrossDevice
	| RenameError
);

export type RenameResult = (
	| DEither.Right<"file-system-rename", string & DPath.Path>
	| DEither.Left<"file-system-rename-error", RenameErrors>
);

function handleNodeRenameError(error: Error) {
	let renameError: RenameErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			renameError = new RenameErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			renameError = new RenameErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			renameError = new RenameErrorAlreadyExists(error);
		} else if (error.code === "EISDIR") {
			renameError = new RenameErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			renameError = new RenameErrorNotDirectory(error);
		} else if (error.code === "ENOTEMPTY") {
			renameError = new RenameErrorDirectoryNotEmpty(error);
		} else if (error.code === "EROFS") {
			renameError = new RenameErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			renameError = new RenameErrorInvalidArgument(error);
		} else if (error.code === "EBUSY") {
			renameError = new RenameErrorBusy(error);
		} else if (error.code === "EXDEV") {
			renameError = new RenameErrorCrossDevice(error);
		}
	}

	if (renameError === undefined) {
		renameError = new RenameError(error);
	}

	return DEither.left("file-system-rename-error", renameError);
}

function handleDenoRenameError(error: Error) {
	let renameError: RenameErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		renameError = new RenameErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		renameError = new RenameErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		renameError = new RenameErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		renameError = new RenameErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		renameError = new RenameErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		renameError = new RenameErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		renameError = new RenameErrorBusy(error);
	}

	if (renameError === undefined) {
		renameError = new RenameError(error);
	}

	return DEither.left("file-system-rename-error", renameError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		rename(
			path: string & DPath.Path,
			newName: string & DPath.Segment,
		): Promise<RenameResult>;
	}
}

const renameImplementation = implementFunction(
	"rename",
	{
		NODE: async(path, newName) => {
			const fs = await nodeFileSystem.value;

			const parentPath = DPath.getParentFolderPath(path);

			if (!parentPath) {
				return DEither.left(
					"file-system-rename-error",
					new RenameErrorInvalidArgument(new Error(`Invalid parent path ${path}.`)),
				);
			}

			const newPath = DPath.resolveRelative([parentPath, newName]);

			return fs.rename(
				path,
				newPath,
			)
				.then(() => DEither.right("file-system-rename", newPath))
				.catch(handleNodeRenameError);
		},
		DENO: async(path, newName) => {
			const parentPath = DPath.getParentFolderPath(path);

			if (!parentPath) {
				return Promise.resolve(
					DEither.left(
						"file-system-rename-error",
						new RenameErrorInvalidArgument(new Error(`Invalid parent path ${path}.`)),
					),
				);
			}

			const newPath = DPath.resolveRelative([parentPath, newName]);

			return Deno.rename(
				path,
				newPath,
			)
				.then(() => DEither.right("file-system-rename", newPath))
				.catch(handleDenoRenameError);
		},
	},
);

export function rename(
	newName: string & DPath.Segment,
): (
	path: string & DPath.Path,
) => Promise<RenameResult>;

export function rename(
	path: string & DPath.Path,
	newName: string & DPath.Segment,
): Promise<RenameResult>;

export function rename(
	...args:
		| [newName: string & DPath.Segment]
		| [path: string & DPath.Path, newName: string & DPath.Segment]
) {
	if (args.length === 1) {
		const [newName] = args;

		return (path: string & DPath.Path) => renameImplementation(
			path,
			newName,
		);
	}

	return renameImplementation(...args);
}
