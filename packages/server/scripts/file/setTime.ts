import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

interface SetTimeParams {
	accessTime: DChrono.TheDate;
	modifiedTime: DChrono.TheDate;
}

export type SetTimeResult = FileSystemEither<
	| DEither.Right<"set-time", void>
	| DEither.Left<"set-time-not-found", unknown>
	| DEither.Left<"set-time-permission-denied", unknown>
	| DEither.Left<"set-time-not-directory", unknown>
	| DEither.Left<"set-time-read-only", unknown>
	| DEither.Left<"set-time-invalid-argument", unknown>
	| DEither.Left<"set-time-error", unknown>
>;

function handleNodeSetTimeError(error: unknown): SetTimeResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-set-time-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-set-time-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-set-time-not-directory", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-set-time-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-set-time-invalid-argument", error);
		}
	}

	return DEither.left("file-system-set-time-error", error);
}

function handleDenoSetTimeError(error: unknown): SetTimeResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-set-time-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-set-time-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-set-time-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-set-time-invalid-argument", error);
	}

	return DEither.left("file-system-set-time-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		setTime(
			path: string & DPath.Path,
			params: SetTimeParams
		): Promise<SetTimeResult>;
	}
}

const setTimeImplementation = implementFunction(
	"setTime",
	{
		NODE: async(path, { accessTime, modifiedTime }) => {
			const fs = await nodeFileSystem.value;
			return fs.utimes(
				path,
				DChrono.toTimestamp(accessTime),
				DChrono.toTimestamp(modifiedTime),
			)
				.then(() => DEither.right("file-system-set-time"))
				.catch(handleNodeSetTimeError);
		},
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
	path: string & DPath.Path,
) => Promise<SetTimeResult>;

export function setTime(
	path: string & DPath.Path,
	params: SetTimeParams,
): Promise<SetTimeResult>;

export function setTime(
	...args:
		| [params: SetTimeParams]
		| [path: string & DPath.Path, params: SetTimeParams]
) {
	if (args.length === 1) {
		const [params] = args;

		return (path: string & DPath.Path) => setTimeImplementation(
			path,
			params,
		);
	}

	return setTimeImplementation(...args);
}
