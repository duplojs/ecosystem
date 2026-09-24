import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type ExistsResult = FileSystemEither<
	| DEither.Right<"exists", void>
	| DEither.Left<"exists-not-found", unknown>
	| DEither.Left<"exists-permission-denied", unknown>
	| DEither.Left<"exists-not-directory", unknown>
	| DEither.Left<"exists-too-many-open-files", unknown>
	| DEither.Left<"exists-error", unknown>
>;

function handleNodeExistsError(error: unknown): ExistsResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-exists-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-exists-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-exists-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-exists-too-many-open-files", error);
		}
	}

	return DEither.left("file-system-exists-error", error);
}

function handleDenoExistsError(error: unknown): ExistsResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-exists-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-exists-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-exists-not-directory", error);
	}

	return DEither.left("file-system-exists-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		exists(path: string & DPath.Path): Promise<ExistsResult>;
	}
}

export const exists = implementFunction(
	"exists",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.access(path)
				.then(() => DEither.right("file-system-exists"))
				.catch(handleNodeExistsError);
		},
		DENO: (path) => Deno
			.stat(path)
			.then(() => DEither.right("file-system-exists"))
			.catch(handleDenoExistsError),
		BUN: (path) => Bun.file(path)
			.exists()
			.then(
				(value) => value
					? DEither.right("file-system-exists")
					: DEither.left("file-system-exists-not-found", new Error("Path does not exist")),
			)
			.catch(handleNodeExistsError),
	},
);
