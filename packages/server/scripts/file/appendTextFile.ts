import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type AppendTextFileResult = FileSystemEither<
	| DEither.Right<"append-text-file", void>
	| DEither.Left<"append-text-file-not-found", unknown>
	| DEither.Left<"append-text-file-permission-denied", unknown>
	| DEither.Left<"append-text-file-is-directory", unknown>
	| DEither.Left<"append-text-file-not-directory", unknown>
	| DEither.Left<"append-text-file-no-space", unknown>
	| DEither.Left<"append-text-file-read-only", unknown>
	| DEither.Left<"append-text-file-invalid-argument", unknown>
	| DEither.Left<"append-text-file-too-many-open-files", unknown>
	| DEither.Left<"append-text-file-busy", unknown>
	| DEither.Left<"append-text-file-error", unknown>
>;

function handleNodeAppendTextFileError(error: unknown): AppendTextFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-append-text-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-append-text-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-append-text-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-append-text-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-append-text-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-append-text-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-append-text-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-append-text-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-append-text-file-busy", error);
		}
	}

	return DEither.left("file-system-append-text-file-error", error);
}

function handleDenoAppendTextFileError(error: unknown): AppendTextFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-append-text-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-append-text-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-append-text-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-append-text-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-append-text-file-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-append-text-file-busy", error);
	}

	return DEither.left("file-system-append-text-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		appendTextFile(
			path: string & DPath.Path,
			data: string,
		): Promise<AppendTextFileResult>;
	}
}

const appendTextFileImplementation = implementFunction(
	"appendTextFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.appendFile(
				path,
				data,
			)
				.then(() => DEither.right("file-system-append-text-file"))
				.catch(handleNodeAppendTextFileError);
		},
		DENO: (path, data) => Deno.writeTextFile(
			path,
			data,
			{ append: true },
		)
			.then(() => DEither.right("file-system-append-text-file"))
			.catch(handleDenoAppendTextFileError),
	},
);

export function appendTextFile(
	data: string,
): (
	path: string & DPath.Path,
) => Promise<AppendTextFileResult>;

export function appendTextFile(
	path: string & DPath.Path,
	data: string,
): Promise<AppendTextFileResult>;

export function appendTextFile(
	...args:
		| [data: string]
		| [path: string & DPath.Path, data: string]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => appendTextFileImplementation(
			path,
			data,
		);
	}

	return appendTextFileImplementation(...args);
}
