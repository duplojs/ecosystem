import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

export class CopyErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-copy-not-found", Error) {}
export class CopyErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-copy-permission-denied", Error) {}
export class CopyErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-copy-already-exists", Error) {}
export class CopyErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-copy-not-directory", Error) {}
export class CopyErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-copy-no-space", Error) {}
export class CopyErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-copy-read-only", Error) {}
export class CopyErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-copy-invalid-argument", Error) {}
export class CopyErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-copy-too-many-open-files", Error) {}
export class CopyErrorBusy extends DCommon.DuploJSError.parentClass("file-system-copy-busy", Error) {}
export class CopyError extends DCommon.DuploJSError.parentClass("file-system-copy-error", Error) {}

export type CopyErrors = (
	| CopyErrorNotFound
	| CopyErrorPermissionDenied
	| CopyErrorAlreadyExists
	| CopyErrorNotDirectory
	| CopyErrorNoSpace
	| CopyErrorReadOnly
	| CopyErrorInvalidArgument
	| CopyErrorTooManyOpenFiles
	| CopyErrorBusy
	| CopyError
);

export type CopyResult = (
	| DEither.Right<"file-system-copy", void>
	| DEither.Left<"file-system-copy-error", CopyErrors>
);

function handleNodeCopyError(error: Error) {
	let copyError: CopyErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			copyError = new CopyErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			copyError = new CopyErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			copyError = new CopyErrorAlreadyExists(error);
		} else if (error.code === "ENOTDIR") {
			copyError = new CopyErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			copyError = new CopyErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			copyError = new CopyErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			copyError = new CopyErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			copyError = new CopyErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			copyError = new CopyErrorBusy(error);
		}
	}

	if (copyError === undefined) {
		copyError = new CopyError(error);
	}

	return DEither.left("file-system-copy-error", copyError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		copy(
			fromPath: DPath.AnyPath,
			toPath: DPath.AnyPath,
		): Promise<CopyResult>;
	}
}

const copyImplementation = implementFunction(
	"copy",
	{
		NODE: async(fromPath, toPath) => nodeFileSystem.value.cp(
			fromPath,
			toPath,
			{ recursive: true },
		)
			.then(() => DEither.right("file-system-copy"))
			.catch(handleNodeCopyError),
	},
);

export function copy(
	toPath: DPath.AnyPath,
): (
	fromPath: DPath.AnyPath,
) => Promise<CopyResult>;

export function copy(
	fromPath: DPath.AnyPath,
	toPath: DPath.AnyPath,
): Promise<CopyResult>;

export function copy(
	...args:
		| [toPath: DPath.AnyPath]
		| [fromPath: DPath.AnyPath, toPath: DPath.AnyPath]
) {
	if (args.length === 1) {
		const [toPath] = args;

		return (fromPath: DPath.AnyPath) => copyImplementation(
			fromPath,
			toPath,
		);
	}

	return copyImplementation(...args);
}
