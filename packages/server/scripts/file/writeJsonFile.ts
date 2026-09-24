import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

interface WriteJsonFile {
	space?: number;
}

export type WriteJsonFileResult = FileSystemEither<
	| DEither.Right<"write-json-file", void>
	| DEither.Left<"write-json-file-not-found", unknown>
	| DEither.Left<"write-json-file-permission-denied", unknown>
	| DEither.Left<"write-json-file-is-directory", unknown>
	| DEither.Left<"write-json-file-not-directory", unknown>
	| DEither.Left<"write-json-file-no-space", unknown>
	| DEither.Left<"write-json-file-read-only", unknown>
	| DEither.Left<"write-json-file-invalid-argument", unknown>
	| DEither.Left<"write-json-file-too-many-open-files", unknown>
	| DEither.Left<"write-json-file-busy", unknown>
	| DEither.Left<"write-json-file-error", unknown>
>;

function handleNodeWriteJsonFileError(error: unknown): WriteJsonFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-write-json-file-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-write-json-file-permission-denied", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-write-json-file-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-write-json-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-write-json-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-write-json-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-write-json-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-write-json-file-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-write-json-file-busy", error);
		}
	}

	return DEither.left("file-system-write-json-file-error", error);
}

function handleDenoWriteJsonFileError(error: unknown): WriteJsonFileResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-write-json-file-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-write-json-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-write-json-file-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-write-json-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-write-json-file-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-write-json-file-busy", error);
	}

	return DEither.left("file-system-write-json-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		writeJsonFile(
			path: string & DPath.Path,
			data: unknown,
			params?: WriteJsonFile
		): Promise<WriteJsonFileResult>;
	}
}

const writeJsonFileImplementation = implementFunction(
	"writeJsonFile",
	{
		NODE: async(path, data, params) => {
			const fs = await nodeFileSystem.value;
			return DCommon.pipe(
				DEither.safeCallback(
					() => JSON.stringify(
						data,
						null,
						params?.space,
					),
				),
				DEither.matchInformation({
					"safe-callback-error": (value) => DEither.left("file-system-write-json-file-error", value),
					"safe-callback-success": (value) => fs
						.writeFile(
							path,
							value,
							{ encoding: "utf-8" },
						)
						.then(() => DEither.right("file-system-write-json-file"))
						.catch(handleNodeWriteJsonFileError),
				}),
			);
		},
		DENO: async(path, data, params) => DCommon.pipe(
			DEither.safeCallback(
				() => JSON.stringify(
					data,
					null,
					params?.space,
				),
			),
			DEither.matchInformation({
				"safe-callback-error": (value) => DEither.left("file-system-write-json-file-error", value),
				"safe-callback-success": (value) => Deno
					.writeTextFile(
						path,
						value,
					)
					.then(() => DEither.right("file-system-write-json-file"))
					.catch(handleDenoWriteJsonFileError),
			}),
		),
		BUN: async(path, data, params) => DCommon.pipe(
			DEither.safeCallback(
				() => JSON.stringify(
					data,
					null,
					params?.space,
				),
			),
			DEither.matchInformation({
				"safe-callback-error": (value) => DEither.left("file-system-write-json-file-error", value),
				"safe-callback-success": (value) => Bun.file(path)
					.write(value)
					.then(() => DEither.right("file-system-write-json-file"))
					.catch(handleNodeWriteJsonFileError),
			}),
		),
	},
);

export function writeJsonFile(
	data: unknown,
): (
	path: string & DPath.Path,
) => Promise<WriteJsonFileResult>;

export function writeJsonFile(
	path: string & DPath.Path,
	data: unknown,
	params?: WriteJsonFile,
): Promise<WriteJsonFileResult>;

export function writeJsonFile(
	...args:
		| [data: unknown]
		| [path: string & DPath.Path, data: unknown, params?: WriteJsonFile]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: string & DPath.Path) => writeJsonFileImplementation(
			path,
			data,
		);
	}

	return writeJsonFileImplementation(...args);
}
