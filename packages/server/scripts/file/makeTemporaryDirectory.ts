import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type MakeTemporaryDirectoryResult = FileSystemEither<
	| DEither.Right<"make-temporary-directory", string>
	| DEither.Left<"make-temporary-directory-permission-denied", unknown>
	| DEither.Left<"make-temporary-directory-not-directory", unknown>
	| DEither.Left<"make-temporary-directory-no-space", unknown>
	| DEither.Left<"make-temporary-directory-read-only", unknown>
	| DEither.Left<"make-temporary-directory-invalid-argument", unknown>
	| DEither.Left<"make-temporary-directory-too-many-open-files", unknown>
	| DEither.Left<"make-temporary-directory-error", unknown>
>;

function handleNodeMakeTemporaryDirectoryError(error: unknown): MakeTemporaryDirectoryResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-make-temporary-directory-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-make-temporary-directory-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-make-temporary-directory-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-make-temporary-directory-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-make-temporary-directory-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-make-temporary-directory-too-many-open-files", error);
		}
	}

	return DEither.left("file-system-make-temporary-directory-error", error);
}

function handleDenoMakeTemporaryDirectoryError(error: unknown): MakeTemporaryDirectoryResult {
	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-make-temporary-directory-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-make-temporary-directory-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-make-temporary-directory-invalid-argument", error);
	}

	return DEither.left("file-system-make-temporary-directory-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		makeTemporaryDirectory(prefix: string): Promise<MakeTemporaryDirectoryResult>;
	}
}

export const makeTemporaryDirectory = implementFunction(
	"makeTemporaryDirectory",
	{
		NODE: async(prefix) => {
			const fs = await nodeFileSystem.value;
			return fs.mkdtemp(prefix)
				.then((value) => DEither.right("file-system-make-temporary-directory", value))
				.catch(handleNodeMakeTemporaryDirectoryError);
		},
		DENO: (prefix) => Deno.makeTempDir({ prefix })
			.then((value) => DEither.right("file-system-make-temporary-directory", value))
			.catch(handleDenoMakeTemporaryDirectoryError),
	},
);
