import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

interface SetTimeParams {
	accessTime: DChrono.TheDate;
	modifiedTime: DChrono.TheDate;
}

export class SetTimeErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-set-time-not-found", Error) {}
export class SetTimeErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-set-time-permission-denied", Error) {}
export class SetTimeErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-set-time-not-directory", Error) {}
export class SetTimeErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-set-time-read-only", Error) {}
export class SetTimeErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-set-time-invalid-argument", Error) {}
export class SetTimeError extends DCommon.DuploJSError.parentClass("file-system-set-time-error", Error) {}

export type SetTimeErrors = (
	| SetTimeErrorNotFound
	| SetTimeErrorPermissionDenied
	| SetTimeErrorNotDirectory
	| SetTimeErrorReadOnly
	| SetTimeErrorInvalidArgument
	| SetTimeError
);

export type SetTimeResult = (
	| DEither.Right<"file-system-set-time", void>
	| DEither.Left<"file-system-set-time-error", SetTimeErrors>
);

function handleNodeSetTimeError(error: Error) {
	let setTimeError: SetTimeErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			setTimeError = new SetTimeErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			setTimeError = new SetTimeErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			setTimeError = new SetTimeErrorNotDirectory(error);
		} else if (error.code === "EROFS") {
			setTimeError = new SetTimeErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			setTimeError = new SetTimeErrorInvalidArgument(error);
		}
	}

	if (setTimeError === undefined) {
		setTimeError = new SetTimeError(error);
	}

	return DEither.left("file-system-set-time-error", setTimeError);
}

function handleDenoSetTimeError(error: Error) {
	let setTimeError: SetTimeErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		setTimeError = new SetTimeErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		setTimeError = new SetTimeErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		setTimeError = new SetTimeErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		setTimeError = new SetTimeErrorInvalidArgument(error);
	}

	if (setTimeError === undefined) {
		setTimeError = new SetTimeError(error);
	}

	return DEither.left("file-system-set-time-error", setTimeError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		setTime(
			path: DPath.AnyPath,
			params: SetTimeParams
		): Promise<SetTimeResult>;
	}
}

const setTimeImplementation = implementFunction(
	"setTime",
	{
		NODE: async(path, { accessTime, modifiedTime }) => nodeFileSystem.value.utimes(
			path,
			DChrono.toTimestamp(accessTime),
			DChrono.toTimestamp(modifiedTime),
		)
			.then(() => DEither.right("file-system-set-time"))
			.catch(handleNodeSetTimeError),
		DENO: (path, { accessTime, modifiedTime }) => Deno
			.utime(
				path,
				DChrono.toTimestamp(accessTime),
				DChrono.toTimestamp(modifiedTime),
			)
			.then(() => DEither.right("file-system-set-time"))
			.catch(handleDenoSetTimeError),
	},
);

export function setTime(
	params: SetTimeParams,
): (
	path: DPath.AnyPath,
) => Promise<SetTimeResult>;

export function setTime(
	path: DPath.AnyPath,
	params: SetTimeParams,
): Promise<SetTimeResult>;

export function setTime(
	...args:
		| [params: SetTimeParams]
		| [path: DPath.AnyPath, params: SetTimeParams]
) {
	if (args.length === 1) {
		const [params] = args;

		return (path: DPath.AnyPath) => setTimeImplementation(
			path,
			params,
		);
	}

	return setTimeImplementation(...args);
}
