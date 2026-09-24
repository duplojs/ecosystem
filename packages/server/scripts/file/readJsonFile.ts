import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type ReadJsonFileResult = FileSystemEither<
	| DEither.Right<"read-json-file", DCommon.Json>
	| DEither.Left<"read-json-file-not-found", unknown>
	| DEither.Left<"read-json-file-permission-denied", unknown>
	| DEither.Left<"read-json-file-is-directory", unknown>
	| DEither.Left<"read-json-file-not-directory", unknown>
	| DEither.Left<"read-json-file-too-many-open-files", unknown>
	| DEither.Left<"read-json-file-busy", unknown>
	| DEither.Left<"read-json-file-error", unknown>
>;

function handleNodeReadJsonFileError(error: unknown): ReadJsonFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-read-json-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-read-json-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-read-json-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-read-json-file-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-read-json-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-read-json-file-busy", error);
		}
	}

	return DEither.left("file-system-read-json-file-error", error);
}

function handleDenoReadJsonFileError(error: unknown): ReadJsonFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-read-json-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-read-json-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-read-json-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-read-json-file-not-directory", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-read-json-file-busy", error);
	}

	return DEither.left("file-system-read-json-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readJsonFile(path: string & DPath.Path): Promise<ReadJsonFileResult>;
	}
}

export const readJsonFile = implementFunction(
	"readJsonFile",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readFile(path, { encoding: "utf-8" })
				.then(JSON.parse)
				.then((value) => DEither.right("file-system-read-json-file", value))
				.catch(handleNodeReadJsonFileError);
		},

		DENO: (path) => Deno.readTextFile(path)
			.then(JSON.parse)
			.then((value) => DEither.right("file-system-read-json-file", value))
			.catch(handleDenoReadJsonFileError),

		BUN: (path) => Bun.file(path)
			.text()
			.then(JSON.parse)
			.then((value) => DEither.right("file-system-read-json-file", value))
			.catch(handleNodeReadJsonFileError),
	},
);
