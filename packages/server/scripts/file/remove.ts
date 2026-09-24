import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

interface RemoveDirectoryParams {
	recursive?: boolean;
}

export type RemoveResult = FileSystemEither<
	| DEither.Right<"remove", void>
	| DEither.Left<"remove-not-found", unknown>
	| DEither.Left<"remove-permission-denied", unknown>
	| DEither.Left<"remove-is-directory", unknown>
	| DEither.Left<"remove-not-directory", unknown>
	| DEither.Left<"remove-directory-not-empty", unknown>
	| DEither.Left<"remove-read-only", unknown>
	| DEither.Left<"remove-invalid-argument", unknown>
	| DEither.Left<"remove-busy", unknown>
	| DEither.Left<"remove-error", unknown>
>;

function handleNodeRemoveError(error: unknown): RemoveResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-remove-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-remove-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-remove-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-remove-not-directory", error);
		} else if (error.code === "ENOTEMPTY") {
			return DEither.left("file-system-remove-directory-not-empty", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-remove-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-remove-invalid-argument", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-remove-busy", error);
		}
	}

	return DEither.left("file-system-remove-error", error);
}

function handleDenoRemoveError(error: unknown): RemoveResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-remove-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-remove-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-remove-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-remove-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-remove-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-remove-busy", error);
	}

	return DEither.left("file-system-remove-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		remove(
			path: string & DPath.Path,
			params?: RemoveDirectoryParams
		): Promise<RemoveResult>;
	}
}

export const remove = implementFunction(
	"remove",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;
			return fs.rm(
				path,
				{
					recursive: params?.recursive ?? false,
					force: true,
				},
			)
				.then(() => DEither.right("file-system-remove"))
				.catch(handleNodeRemoveError);
		},
		DENO: (path, params) => Deno.remove(
			path,
			{
				recursive: params?.recursive,
			},
		)
			.then(() => DEither.right("file-system-remove"))
			.catch(handleDenoRemoveError),
	},
);
