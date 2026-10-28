import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

export class MoveErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-move-not-found", Error) {}
export class MoveErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-move-permission-denied", Error) {}
export class MoveErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-move-already-exists", Error) {}
export class MoveErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-move-is-directory", Error) {}
export class MoveErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-move-not-directory", Error) {}
export class MoveErrorDirectoryNotEmpty extends DCommon.DuploJSError.parentClass("file-system-move-directory-not-empty", Error) {}
export class MoveErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-move-read-only", Error) {}
export class MoveErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-move-invalid-argument", Error) {}
export class MoveErrorBusy extends DCommon.DuploJSError.parentClass("file-system-move-busy", Error) {}
export class MoveErrorCrossDevice extends DCommon.DuploJSError.parentClass("file-system-move-cross-device", Error) {}
export class MoveError extends DCommon.DuploJSError.parentClass("file-system-move-error", Error) {}

export type MoveErrors = (
	| MoveErrorNotFound
	| MoveErrorPermissionDenied
	| MoveErrorAlreadyExists
	| MoveErrorIsDirectory
	| MoveErrorNotDirectory
	| MoveErrorDirectoryNotEmpty
	| MoveErrorReadOnly
	| MoveErrorInvalidArgument
	| MoveErrorBusy
	| MoveErrorCrossDevice
	| MoveError
);

export type MoveResult = (
	| DEither.Right<"file-system-move", void>
	| DEither.Left<"file-system-move-error", MoveErrors>
);

function handleNodeMoveError(error: Error) {
	let moveError: MoveErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			moveError = new MoveErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			moveError = new MoveErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			moveError = new MoveErrorAlreadyExists(error);
		} else if (error.code === "EISDIR") {
			moveError = new MoveErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			moveError = new MoveErrorNotDirectory(error);
		} else if (error.code === "ENOTEMPTY") {
			moveError = new MoveErrorDirectoryNotEmpty(error);
		} else if (error.code === "EROFS") {
			moveError = new MoveErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			moveError = new MoveErrorInvalidArgument(error);
		} else if (error.code === "EBUSY") {
			moveError = new MoveErrorBusy(error);
		} else if (error.code === "EXDEV") {
			moveError = new MoveErrorCrossDevice(error);
		}
	}

	if (moveError === undefined) {
		moveError = new MoveError(error);
	}

	return DEither.left("file-system-move-error", moveError);
}

function handleDenoMoveError(error: Error) {
	let moveError: MoveErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		moveError = new MoveErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		moveError = new MoveErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		moveError = new MoveErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		moveError = new MoveErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		moveError = new MoveErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		moveError = new MoveErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		moveError = new MoveErrorBusy(error);
	}

	if (moveError === undefined) {
		moveError = new MoveError(error);
	}

	return DEither.left("file-system-move-error", moveError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		move(
			fromPath: DPath.AnyPath,
			toPath: DPath.AnyPath,
		): Promise<MoveResult>;
	}
}

const moveImplementation = implementFunction(
	"move",
	{
		NODE: async(fromPath, toPath) => nodeFileSystem.value.rename(
			fromPath,
			toPath,
		)
			.then(() => DEither.right("file-system-move"))
			.catch(handleNodeMoveError),
		DENO: (fromPath, toPath) => Deno.rename(
			fromPath,
			toPath,
		)
			.then(() => DEither.right("file-system-move"))
			.catch(handleDenoMoveError),
	},
);

export function move(
	toPath: DPath.AnyPath,
): (
	fromPath: DPath.AnyPath,
) => Promise<MoveResult>;

export function move(
	fromPath: DPath.AnyPath,
	toPath: DPath.AnyPath,
): Promise<MoveResult>;

export function move(
	...args:
		| [toPath: DPath.AnyPath]
		| [fromPath: DPath.AnyPath, toPath: DPath.AnyPath]
) {
	if (args.length === 1) {
		const [toPath] = args;

		return (fromPath: DPath.AnyPath) => moveImplementation(
			fromPath,
			toPath,
		);
	}

	return moveImplementation(...args);
}
