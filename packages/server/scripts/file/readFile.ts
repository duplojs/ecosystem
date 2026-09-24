import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type ReadFileResult = FileSystemEither<
	| DEither.Right<"read-file", Uint8Array>
	| DEither.Left<"read-file-not-found", unknown>
	| DEither.Left<"read-file-permission-denied", unknown>
	| DEither.Left<"read-file-is-directory", unknown>
	| DEither.Left<"read-file-not-directory", unknown>
	| DEither.Left<"read-file-too-many-open-files", unknown>
	| DEither.Left<"read-file-busy", unknown>
	| DEither.Left<"read-file-error", unknown>
>;

function handleNodeReadFileError(error: unknown): ReadFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-read-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-read-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-read-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-read-file-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-read-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-read-file-busy", error);
		}
	}

	return DEither.left("file-system-read-file-error", error);
}

function handleDenoReadFileError(error: unknown): ReadFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-read-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-read-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-read-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-read-file-not-directory", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-read-file-busy", error);
	}

	return DEither.left("file-system-read-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readFile(path: string & DPath.Path): Promise<ReadFileResult>;
	}
}

export const readFile = implementFunction(
	"readFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readFile(path)
				.then((value) => DEither.right("file-system-read-file", value))
				.catch(handleNodeReadFileError);
		},
		DENO: (path) => Deno
			.readFile(path)
			.then((value) => DEither.right("file-system-read-file", value))
			.catch(handleDenoReadFileError),
		BUN: (path) => Bun.file(path)
			.bytes()
			.then((value) => DEither.right("file-system-read-file", value))
			.catch(handleNodeReadFileError),
	},
);
