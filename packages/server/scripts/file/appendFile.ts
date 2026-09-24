import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type AppendFileResult = FileSystemEither<
	| DEither.Right<"append-file", void>
	| DEither.Left<"append-file-not-found", unknown>
	| DEither.Left<"append-file-permission-denied", unknown>
	| DEither.Left<"append-file-is-directory", unknown>
	| DEither.Left<"append-file-not-directory", unknown>
	| DEither.Left<"append-file-no-space", unknown>
	| DEither.Left<"append-file-read-only", unknown>
	| DEither.Left<"append-file-invalid-argument", unknown>
	| DEither.Left<"append-file-too-many-open-files", unknown>
	| DEither.Left<"append-file-busy", unknown>
	| DEither.Left<"append-file-error", unknown>
>;

function handleNodeAppendFileError(error: unknown): AppendFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-append-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-append-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-append-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-append-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-append-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-append-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-append-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-append-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-append-file-busy", error);
		}
	}

	return DEither.left("file-system-append-file-error", error);
}

function handleDenoAppendFileError(error: unknown): AppendFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-append-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-append-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-append-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-append-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-append-file-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-append-file-busy", error);
	}

	return DEither.left("file-system-append-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		appendFile(
			path: string & DPath.Path,
			data: Uint8Array,
		): Promise<AppendFileResult>;
	}
}

const appendFileImplementation = implementFunction(
	"appendFile",
	{
		NODE: async(path, data) => {
			const fs = await nodeFileSystem.value;
			return fs.appendFile(
				path,
				data,
			)
				.then(() => DEither.right("file-system-append-file"))
				.catch(handleNodeAppendFileError);
		},
		DENO: (path, data) => Deno.writeFile(
			path,
			data,
			{ append: true },
		)
			.then(() => DEither.right("file-system-append-file"))
			.catch(handleDenoAppendFileError),
	},
);

export function appendFile(
	data: Uint8Array,
): (
	path: string & DPath.Path,
) => Promise<AppendFileResult>;

export function appendFile(
	path: string & DPath.Path,
	data: Uint8Array,
): Promise<AppendFileResult>;

export function appendFile(
	...args:
		| [data: Uint8Array]
		| [path: string & DPath.Path, data: Uint8Array]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => appendFileImplementation(
			path,
			data,
		);
	}

	return appendFileImplementation(...args);
}
