import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

export class RelocateErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-relocate-not-found", Error) {}
export class RelocateErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-relocate-permission-denied", Error) {}
export class RelocateErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-relocate-already-exists", Error) {}
export class RelocateErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-relocate-is-directory", Error) {}
export class RelocateErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-relocate-not-directory", Error) {}
export class RelocateErrorDirectoryNotEmpty extends DCommon.DuploJSError.parentClass("file-system-relocate-directory-not-empty", Error) {}
export class RelocateErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-relocate-read-only", Error) {}
export class RelocateErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-relocate-invalid-argument", Error) {}
export class RelocateErrorBusy extends DCommon.DuploJSError.parentClass("file-system-relocate-busy", Error) {}
export class RelocateErrorCrossDevice extends DCommon.DuploJSError.parentClass("file-system-relocate-cross-device", Error) {}
export class RelocateError extends DCommon.DuploJSError.parentClass("file-system-relocate-error", Error) {}

export type RelocateErrors = (
	| RelocateErrorNotFound
	| RelocateErrorPermissionDenied
	| RelocateErrorAlreadyExists
	| RelocateErrorIsDirectory
	| RelocateErrorNotDirectory
	| RelocateErrorDirectoryNotEmpty
	| RelocateErrorReadOnly
	| RelocateErrorInvalidArgument
	| RelocateErrorBusy
	| RelocateErrorCrossDevice
	| RelocateError
);

export type RelocateResult = (
	| DEither.Right<"file-system-relocate", string & DPath.Path>
	| DEither.Left<"file-system-relocate-error", RelocateErrors>
);

function handleNodeRelocateError(error: Error) {
	let relocateError: RelocateErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			relocateError = new RelocateErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			relocateError = new RelocateErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			relocateError = new RelocateErrorAlreadyExists(error);
		} else if (error.code === "EISDIR") {
			relocateError = new RelocateErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			relocateError = new RelocateErrorNotDirectory(error);
		} else if (error.code === "ENOTEMPTY") {
			relocateError = new RelocateErrorDirectoryNotEmpty(error);
		} else if (error.code === "EROFS") {
			relocateError = new RelocateErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			relocateError = new RelocateErrorInvalidArgument(error);
		} else if (error.code === "EBUSY") {
			relocateError = new RelocateErrorBusy(error);
		} else if (error.code === "EXDEV") {
			relocateError = new RelocateErrorCrossDevice(error);
		}
	}

	if (relocateError === undefined) {
		relocateError = new RelocateError(error);
	}

	return DEither.left("file-system-relocate-error", relocateError);
}

function handleDenoRelocateError(error: Error) {
	let relocateError: RelocateErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		relocateError = new RelocateErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		relocateError = new RelocateErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		relocateError = new RelocateErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		relocateError = new RelocateErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		relocateError = new RelocateErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		relocateError = new RelocateErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		relocateError = new RelocateErrorBusy(error);
	}

	if (relocateError === undefined) {
		relocateError = new RelocateError(error);
	}

	return DEither.left("file-system-relocate-error", relocateError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		relocate(
			fromPath: DPath.AnyPath,
			toPath: DPath.AnyPath,
		): Promise<RelocateResult>;
	}
}

const relocateImplementation = implementFunction(
	"relocate",
	{
		NODE: async(fromPath, newParentPath) => {
			const baseName = DPath.getBaseName(fromPath);

			if (!baseName) {
				return DEither.left(
					"file-system-relocate-error",
					new RelocateErrorInvalidArgument(new Error(`Invalid base name ${fromPath}`)),
				);
			}

			const newPath = DPath.resolveRelative([newParentPath, baseName]);

			return nodeFileSystem.value.rename(
				fromPath,
				newPath,
			)
				.then(() => DEither.right("file-system-relocate", newPath))
				.catch(handleNodeRelocateError);
		},
		DENO: async(fromPath, newParentPath) => {
			const baseName = DPath.getBaseName(fromPath);

			if (!baseName) {
				return Promise.resolve(
					DEither.left(
						"file-system-relocate-error",
						new RelocateErrorInvalidArgument(new Error(`Invalid base name ${fromPath}`)),
					),
				);
			}

			const newPath = DPath.resolveRelative([newParentPath, baseName]);

			return Deno.rename(
				fromPath,
				newPath,
			)
				.then(() => DEither.right("file-system-relocate", newPath))
				.catch(handleDenoRelocateError);
		},
	},
);

export function relocate(
	toPath: DPath.AnyPath,
): (
	fromPath: DPath.AnyPath,
) => Promise<RelocateResult>;

export function relocate(
	fromPath: DPath.AnyPath,
	toPath: DPath.AnyPath,
): Promise<RelocateResult>;

export function relocate(
	...args:
		| [toPath: DPath.AnyPath]
		| [fromPath: DPath.AnyPath, toPath: DPath.AnyPath]
) {
	if (args.length === 1) {
		const [toPath] = args;

		return (fromPath: DPath.AnyPath) => relocateImplementation(
			fromPath,
			toPath,
		);
	}

	return relocateImplementation(...args);
}
