import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

interface WriteJsonFileParams {
	space?: number;
}

export class WriteJsonFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-write-json-file-not-found", Error) {}
export class WriteJsonFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-write-json-file-permission-denied", Error) {}
export class WriteJsonFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-write-json-file-is-directory", Error) {}
export class WriteJsonFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-write-json-file-not-directory", Error) {}
export class WriteJsonFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-write-json-file-no-space", Error) {}
export class WriteJsonFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-write-json-file-read-only", Error) {}
export class WriteJsonFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-write-json-file-invalid-argument", Error) {}
export class WriteJsonFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-write-json-file-too-many-open-files", Error) {}
export class WriteJsonFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-write-json-file-busy", Error) {}
export class WriteJsonFileError extends DCommon.DuploJSError.parentClass("file-system-write-json-file-error", Error) {}

export type WriteJsonFileErrors = (
	| WriteJsonFileErrorNotFound
	| WriteJsonFileErrorPermissionDenied
	| WriteJsonFileErrorIsDirectory
	| WriteJsonFileErrorNotDirectory
	| WriteJsonFileErrorNoSpace
	| WriteJsonFileErrorReadOnly
	| WriteJsonFileErrorInvalidArgument
	| WriteJsonFileErrorTooManyOpenFiles
	| WriteJsonFileErrorBusy
	| WriteJsonFileError
);

export type WriteJsonFileResult = (
	| DEither.Right<"file-system-write-json-file", void>
	| DEither.Left<"file-system-write-json-file-error", WriteJsonFileErrors>
);

function handleNodeWriteJsonFileError(error: Error) {
	let writeJsonFileError: WriteJsonFileErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			writeJsonFileError = new WriteJsonFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			writeJsonFileError = new WriteJsonFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			writeJsonFileError = new WriteJsonFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			writeJsonFileError = new WriteJsonFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			writeJsonFileError = new WriteJsonFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			writeJsonFileError = new WriteJsonFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			writeJsonFileError = new WriteJsonFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			writeJsonFileError = new WriteJsonFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			writeJsonFileError = new WriteJsonFileErrorBusy(error);
		}
	}

	if (writeJsonFileError === undefined) {
		writeJsonFileError = new WriteJsonFileError(error);
	}

	return DEither.left("file-system-write-json-file-error", writeJsonFileError);
}

function handleDenoWriteJsonFileError(error: Error) {
	let writeJsonFileError: WriteJsonFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		writeJsonFileError = new WriteJsonFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		writeJsonFileError = new WriteJsonFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		writeJsonFileError = new WriteJsonFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		writeJsonFileError = new WriteJsonFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		writeJsonFileError = new WriteJsonFileErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		writeJsonFileError = new WriteJsonFileErrorBusy(error);
	}

	if (writeJsonFileError === undefined) {
		writeJsonFileError = new WriteJsonFileError(error);
	}

	return DEither.left("file-system-write-json-file-error", writeJsonFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		writeJsonFile(
			path: DPath.AnyPath,
			data: unknown,
			params?: WriteJsonFileParams
		): Promise<WriteJsonFileResult>;
	}
}

const writeJsonFileImplementation = implementFunction(
	"writeJsonFile",
	{
		NODE: async(path, data, params) => DCommon.pipe(
			DEither.safeCallback(
				() => JSON.stringify(
					data,
					null,
					params?.space,
				),
			),
			DEither.matchInformation({
				"safe-callback-error": (value) => DEither.left(
					"file-system-write-json-file-error",
					new WriteJsonFileError(value as never),
				),
				"safe-callback-success": (value) => nodeFileSystem.value
					.writeFile(
						path,
						value,
						{ encoding: "utf-8" },
					)
					.then(() => DEither.right("file-system-write-json-file"))
					.catch(handleNodeWriteJsonFileError),
			}),
		),
		DENO: async(path, data, params) => DCommon.pipe(
			DEither.safeCallback(
				() => JSON.stringify(
					data,
					null,
					params?.space,
				),
			),
			DEither.matchInformation({
				"safe-callback-error": (value) => DEither.left(
					"file-system-write-json-file-error",
					new WriteJsonFileError(value as never),
				),
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
				"safe-callback-error": (value) => DEither.left(
					"file-system-write-json-file-error",
					new WriteJsonFileError(value as never),
				),
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
	path: DPath.AnyPath,
) => Promise<WriteJsonFileResult>;

export function writeJsonFile(
	path: DPath.AnyPath,
	data: unknown,
	params?: WriteJsonFileParams,
): Promise<WriteJsonFileResult>;

export function writeJsonFile(
	...args:
		| [data: unknown]
		| [path: DPath.AnyPath, data: unknown, params?: WriteJsonFileParams]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: DPath.AnyPath) => writeJsonFileImplementation(
			path,
			data,
		);
	}

	return writeJsonFileImplementation(...args);
}
