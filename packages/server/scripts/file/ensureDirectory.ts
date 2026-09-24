import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type EnsureDirectoryResult = FileSystemEither<
	| DEither.Right<"ensure-directory", void>
	| DEither.Left<"ensure-directory-permission-denied", unknown>
	| DEither.Left<"ensure-directory-not-directory", unknown>
	| DEither.Left<"ensure-directory-no-space", unknown>
	| DEither.Left<"ensure-directory-read-only", unknown>
	| DEither.Left<"ensure-directory-invalid-argument", unknown>
	| DEither.Left<"ensure-directory-too-many-open-files", unknown>
	| DEither.Left<"ensure-directory-busy", unknown>
	| DEither.Left<"ensure-directory-error", unknown>
>;

function handleNodeEnsureDirectoryError(error: unknown): EnsureDirectoryResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-ensure-directory-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-ensure-directory-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-ensure-directory-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-ensure-directory-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-ensure-directory-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-ensure-directory-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-ensure-directory-busy", error);
		}
	}

	return DEither.left("file-system-ensure-directory-error", error);
}

function handleDenoEnsureDirectoryError(error: unknown): EnsureDirectoryResult {
	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-ensure-directory-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-ensure-directory-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-ensure-directory-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-ensure-directory-busy", error);
	}

	return DEither.left("file-system-ensure-directory-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		ensureDirectory(path: string & DPath.Path): Promise<EnsureDirectoryResult>;
	}
}

export const ensureDirectory = implementFunction(
	"ensureDirectory",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.mkdir(
				path,
				{
					recursive: true,
				},
			)
				.then(() => DEither.right("file-system-ensure-directory"))
				.catch(handleNodeEnsureDirectoryError);
		},
		DENO: (path) => Deno.mkdir(
			path,
			{
				recursive: true,
			},
		)
			.then(() => DEither.right("file-system-ensure-directory"))
			.catch(handleDenoEnsureDirectoryError),
	},
);
