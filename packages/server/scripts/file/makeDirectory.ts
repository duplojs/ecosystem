import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

interface MakeDirectoryParams {
	recursive?: boolean;
}

export type MakeDirectoryResult = FileSystemEither<
	| DEither.Right<"make-directory", void>
	| DEither.Left<"make-directory-not-found", unknown>
	| DEither.Left<"make-directory-permission-denied", unknown>
	| DEither.Left<"make-directory-already-exists", unknown>
	| DEither.Left<"make-directory-not-directory", unknown>
	| DEither.Left<"make-directory-no-space", unknown>
	| DEither.Left<"make-directory-read-only", unknown>
	| DEither.Left<"make-directory-invalid-argument", unknown>
	| DEither.Left<"make-directory-too-many-open-files", unknown>
	| DEither.Left<"make-directory-busy", unknown>
	| DEither.Left<"make-directory-error", unknown>
>;

function handleNodeMakeDirectoryError(error: unknown): MakeDirectoryResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-make-directory-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-make-directory-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-make-directory-already-exists", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-make-directory-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-make-directory-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-make-directory-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-make-directory-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-make-directory-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-make-directory-busy", error);
		}
	}

	return DEither.left("file-system-make-directory-error", error);
}

function handleDenoMakeDirectoryError(error: unknown): MakeDirectoryResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-make-directory-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-make-directory-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-make-directory-already-exists", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-make-directory-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-make-directory-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-make-directory-busy", error);
	}

	return DEither.left("file-system-make-directory-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		makeDirectory(
			path: string & DPath.Path,
			params?: MakeDirectoryParams
		): Promise<MakeDirectoryResult>;
	}
}

export const makeDirectory = implementFunction(
	"makeDirectory",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;
			return fs.mkdir(
				path,
				{
					recursive: params?.recursive,
				},
			)
				.then(() => DEither.right("file-system-make-directory"))
				.catch(handleNodeMakeDirectoryError);
		},
		DENO: (path, params) => Deno.mkdir(
			path,
			{
				recursive: params?.recursive,
			},
		)
			.then(() => DEither.right("file-system-make-directory"))
			.catch(handleDenoMakeDirectoryError),
	},
);
