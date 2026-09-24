import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type WriteFileResult = FileSystemEither<
	| DEither.Right<"write-file", void>
	| DEither.Left<"write-file-not-found", unknown>
	| DEither.Left<"write-file-permission-denied", unknown>
	| DEither.Left<"write-file-is-directory", unknown>
	| DEither.Left<"write-file-not-directory", unknown>
	| DEither.Left<"write-file-no-space", unknown>
	| DEither.Left<"write-file-read-only", unknown>
	| DEither.Left<"write-file-invalid-argument", unknown>
	| DEither.Left<"write-file-too-many-open-files", unknown>
	| DEither.Left<"write-file-busy", unknown>
	| DEither.Left<"write-file-error", unknown>
>;

function handleNodeWriteFileError(error: unknown): WriteFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-write-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-write-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-write-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-write-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-write-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-write-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-write-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-write-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-write-file-busy", error);
		}
	}

	return DEither.left("file-system-write-file-error", error);
}

function handleDenoWriteFileError(error: unknown): WriteFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-write-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-write-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-write-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-write-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-write-file-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-write-file-busy", error);
	}

	return DEither.left("file-system-write-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		writeFile(
			path: string & DPath.Path,
			data: Uint8Array,
		): Promise<WriteFileResult>;
	}
}

const writeFileImplementation = implementFunction(
	"writeFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.writeFile(
				path,
				data,
			)
				.then(() => DEither.right("file-system-write-file"))
				.catch(handleNodeWriteFileError);
		},
		DENO: (path, data) => Deno
			.writeFile(
				path,
				data,
			)
			.then(() => DEither.right("file-system-write-file"))
			.catch(handleDenoWriteFileError),
		BUN: (path, data) => Bun
			.file(path)
			.write(data)
			.then(() => DEither.right("file-system-write-file"))
			.catch(handleNodeWriteFileError),
	},
);

export function writeFile(
	data: Uint8Array,
): (
	path: string & DPath.Path,
) => Promise<WriteFileResult>;

export function writeFile(
	path: string & DPath.Path,
	data: Uint8Array,
): Promise<WriteFileResult>;

export function writeFile(
	...args:
		| [data: Uint8Array]
		| [path: string & DPath.Path, data: Uint8Array]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => writeFileImplementation(
			path,
			data,
		);
	}

	return writeFileImplementation(...args);
}
