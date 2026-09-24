import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type EnsureFileResult = FileSystemEither<
	| DEither.Right<"ensure-file", void>
	| DEither.Left<"ensure-file-permission-denied", unknown>
	| DEither.Left<"ensure-file-is-directory", unknown>
	| DEither.Left<"ensure-file-not-directory", unknown>
	| DEither.Left<"ensure-file-no-space", unknown>
	| DEither.Left<"ensure-file-read-only", unknown>
	| DEither.Left<"ensure-file-invalid-argument", unknown>
	| DEither.Left<"ensure-file-too-many-open-files", unknown>
	| DEither.Left<"ensure-file-busy", unknown>
	| DEither.Left<"ensure-file-error", unknown>
>;

function handleNodeEnsureFileError(error: unknown): EnsureFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-ensure-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-ensure-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-ensure-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-ensure-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-ensure-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-ensure-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-ensure-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-ensure-file-busy", error);
		}
	}

	return DEither.left("file-system-ensure-file-error", error);
}

function handleDenoEnsureFileError(error: unknown): EnsureFileResult {
	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-ensure-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-ensure-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-ensure-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-ensure-file-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-ensure-file-busy", error);
	}

	return DEither.left("file-system-ensure-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		ensureFile(path: string & DPath.Path): Promise<EnsureFileResult>;
	}
}

export const ensureFile = implementFunction(
	"ensureFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;

			return fs.open(path, "a")
				.then((fh) => fh.close())
				.then(() => DEither.right("file-system-ensure-file"))
				.catch(handleNodeEnsureFileError);
		},
		DENO: (path) => Deno.open(path, {
			write: true,
			create: true,
			append: true,
		})
			.then((fh) => void fh.close())
			.then(() => DEither.right("file-system-ensure-file"))
			.catch(handleDenoEnsureFileError),
	},
);
