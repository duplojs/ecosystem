import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type WriteTextFileResult = FileSystemEither<
	| DEither.Right<"write-text-file", void>
	| DEither.Left<"write-text-file-not-found", unknown>
	| DEither.Left<"write-text-file-permission-denied", unknown>
	| DEither.Left<"write-text-file-is-directory", unknown>
	| DEither.Left<"write-text-file-not-directory", unknown>
	| DEither.Left<"write-text-file-no-space", unknown>
	| DEither.Left<"write-text-file-read-only", unknown>
	| DEither.Left<"write-text-file-invalid-argument", unknown>
	| DEither.Left<"write-text-file-too-many-open-files", unknown>
	| DEither.Left<"write-text-file-busy", unknown>
	| DEither.Left<"write-text-file-error", unknown>
>;

function handleNodeWriteTextFileError(error: unknown): WriteTextFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-write-text-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-write-text-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-write-text-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-write-text-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-write-text-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-write-text-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-write-text-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-write-text-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-write-text-file-busy", error);
		}
	}

	return DEither.left("file-system-write-text-file-error", error);
}

function handleDenoWriteTextFileError(error: unknown): WriteTextFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-write-text-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-write-text-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-write-text-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-write-text-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-write-text-file-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-write-text-file-busy", error);
	}

	return DEither.left("file-system-write-text-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		writeTextFile(
			path: string & DPath.Path,
			data: string,
		): Promise<WriteTextFileResult>;
	}
}

const writeTextFileImplementation = implementFunction(
	"writeTextFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.writeFile(
				path,
				data,
				{ encoding: "utf-8" },
			)
				.then(() => DEither.right("file-system-write-text-file"))
				.catch(handleNodeWriteTextFileError);
		},
		DENO: (path, data) => Deno
			.writeTextFile(
				path,
				data,
			)
			.then(() => DEither.right("file-system-write-text-file"))
			.catch(handleDenoWriteTextFileError),
		BUN: (path, data) => Bun
			.file(path)
			.write(data)
			.then(() => DEither.right("file-system-write-text-file"))
			.catch(handleNodeWriteTextFileError),
	},
);

export function writeTextFile(
	data: string,
): (
	path: string & DPath.Path,
) => Promise<WriteTextFileResult>;

export function writeTextFile(
	path: string & DPath.Path,
	data: string,
): Promise<WriteTextFileResult>;

export function writeTextFile(
	...args:
		| [data: string]
		| [path: string & DPath.Path, data: string]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => writeTextFileImplementation(
			path,
			data,
		);
	}

	return writeTextFileImplementation(...args);
}
