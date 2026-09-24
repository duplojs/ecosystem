import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type ReadTextFileResult = FileSystemEither<
	| DEither.Right<"read-text-file", string>
	| DEither.Left<"read-text-file-not-found", unknown>
	| DEither.Left<"read-text-file-permission-denied", unknown>
	| DEither.Left<"read-text-file-is-directory", unknown>
	| DEither.Left<"read-text-file-not-directory", unknown>
	| DEither.Left<"read-text-file-too-many-open-files", unknown>
	| DEither.Left<"read-text-file-busy", unknown>
	| DEither.Left<"read-text-file-error", unknown>
>;

function handleNodeReadTextFileError(error: unknown): ReadTextFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-read-text-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-read-text-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-read-text-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-read-text-file-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-read-text-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-read-text-file-busy", error);
		}
	}

	return DEither.left("file-system-read-text-file-error", error);
}

function handleDenoReadTextFileError(error: unknown): ReadTextFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-read-text-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-read-text-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-read-text-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-read-text-file-not-directory", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-read-text-file-busy", error);
	}

	return DEither.left("file-system-read-text-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readTextFile(path: string & DPath.Path): Promise<ReadTextFileResult>;
	}
}

export const readTextFile = implementFunction(
	"readTextFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readFile(path, { encoding: "utf-8" })
				.then((value) => DEither.right("file-system-read-text-file", value))
				.catch(handleNodeReadTextFileError);
		},
		DENO: (path) => Deno
			.readTextFile(path)
			.then((value) => DEither.right("file-system-read-text-file", value))
			.catch(handleDenoReadTextFileError),
		BUN: (path) => Bun.file(path)
			.text()
			.then((value) => DEither.right("file-system-read-text-file", value))
			.catch(handleNodeReadTextFileError),
	},
);
