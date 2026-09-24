import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type TruncateResult = FileSystemEither<
	| DEither.Right<"truncate", void>
	| DEither.Left<"truncate-not-found", unknown>
	| DEither.Left<"truncate-permission-denied", unknown>
	| DEither.Left<"truncate-is-directory", unknown>
	| DEither.Left<"truncate-not-directory", unknown>
	| DEither.Left<"truncate-no-space", unknown>
	| DEither.Left<"truncate-read-only", unknown>
	| DEither.Left<"truncate-invalid-argument", unknown>
	| DEither.Left<"truncate-too-many-open-files", unknown>
	| DEither.Left<"truncate-busy", unknown>
	| DEither.Left<"truncate-error", unknown>
>;

function handleNodeTruncateError(error: unknown): TruncateResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-truncate-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-truncate-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-truncate-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-truncate-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-truncate-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-truncate-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-truncate-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-truncate-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-truncate-busy", error);
		}
	}

	return DEither.left("file-system-truncate-error", error);
}

function handleDenoTruncateError(error: unknown): TruncateResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-truncate-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-truncate-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-truncate-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-truncate-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-truncate-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-truncate-busy", error);
	}

	return DEither.left("file-system-truncate-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		truncate(
			path: string & DPath.Path,
			size?: number,
		): Promise<TruncateResult>;
	}
}

export const truncate = implementFunction(
	"truncate",
	{
		NODE: async(path, size) => {
			const fs = await nodeFileSystem.value;
			return fs.truncate(path, size)
				.then(() => DEither.right("file-system-truncate"))
				.catch(handleNodeTruncateError);
		},
		DENO: (path, size) => DCommon.pipe(
			path,
			DCommon.when(
				DCommon.instanceOf(URL),
				({ pathname }) => decodeURIComponent(pathname),
			),
			(stringPath) => Deno
				.truncate(stringPath, size)
				.then(() => DEither.right("file-system-truncate"))
				.catch(handleDenoTruncateError),
		),
	},
);
