import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

export class AppendTextFileErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-append-text-file-not-found", Error) {}
export class AppendTextFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-append-text-file-permission-denied", Error) {}
export class AppendTextFileErrorIsDirectory extends DCommon.DuploJSError.parentClass("file-system-append-text-file-is-directory", Error) {}
export class AppendTextFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-append-text-file-not-directory", Error) {}
export class AppendTextFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-append-text-file-no-space", Error) {}
export class AppendTextFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-append-text-file-read-only", Error) {}
export class AppendTextFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-append-text-file-invalid-argument", Error) {}
export class AppendTextFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-append-text-file-too-many-open-files", Error) {}
export class AppendTextFileErrorBusy extends DCommon.DuploJSError.parentClass("file-system-append-text-file-busy", Error) {}
export class AppendTextFileError extends DCommon.DuploJSError.parentClass("file-system-append-text-file-error", Error) {}

export type AppendTextFileErrors = (
	| AppendTextFileErrorNotFound
	| AppendTextFileErrorPermissionDenied
	| AppendTextFileErrorIsDirectory
	| AppendTextFileErrorNotDirectory
	| AppendTextFileErrorNoSpace
	| AppendTextFileErrorReadOnly
	| AppendTextFileErrorInvalidArgument
	| AppendTextFileErrorTooManyOpenFiles
	| AppendTextFileErrorBusy
	| AppendTextFileError
);

export type AppendTextFileResult = (
	| DEither.Right<"file-system-append-text-file", void>
	| DEither.Left<"file-system-append-text-file-error", AppendTextFileErrors>
);

function handleNodeAppendTextFileError(error: Error) {
	let appendTextFileError: AppendTextFileErrors | undefined = undefined;

	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			appendTextFileError = new AppendTextFileErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			appendTextFileError = new AppendTextFileErrorPermissionDenied(error);
		} else if (error.code === "EISDIR") {
			appendTextFileError = new AppendTextFileErrorIsDirectory(error);
		} else if (error.code === "ENOTDIR") {
			appendTextFileError = new AppendTextFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			appendTextFileError = new AppendTextFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			appendTextFileError = new AppendTextFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			appendTextFileError = new AppendTextFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			appendTextFileError = new AppendTextFileErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			appendTextFileError = new AppendTextFileErrorBusy(error);
		}
	}

	if (appendTextFileError === undefined) {
		appendTextFileError = new AppendTextFileError(error);
	}

	return DEither.left("file-system-append-text-file-error", appendTextFileError);
}

function handleDenoAppendTextFileError(error: Error) {
	let appendTextFileError: AppendTextFileErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		appendTextFileError = new AppendTextFileErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		appendTextFileError = new AppendTextFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.IsADirectory) {
		appendTextFileError = new AppendTextFileErrorIsDirectory(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		appendTextFileError = new AppendTextFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		appendTextFileError = new AppendTextFileErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		appendTextFileError = new AppendTextFileErrorBusy(error);
	}

	if (appendTextFileError === undefined) {
		appendTextFileError = new AppendTextFileError(error);
	}

	return DEither.left("file-system-append-text-file-error", appendTextFileError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		appendTextFile(
			path: DPath.AnyPath,
			data: string,
		): Promise<AppendTextFileResult>;
	}
}

const appendTextFileImplementation = implementFunction(
	"appendTextFile",
	{
		NODE: async(path, data) => nodeFileSystem.value.appendFile(
			path,
			data,
		)
			.then(() => DEither.right("file-system-append-text-file"))
			.catch(handleNodeAppendTextFileError),
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
	path: DPath.AnyPath,
) => Promise<AppendTextFileResult>;

export function appendTextFile(
	path: DPath.AnyPath,
	data: string,
): Promise<AppendTextFileResult>;

export function appendTextFile(
	...args:
		| [data: string]
		| [path: DPath.AnyPath, data: string]
) {
	if (args.length === 1) {
		const [data] = args;

		return (path: DPath.AnyPath) => appendTextFileImplementation(
			path,
			data,
		);
	}

	return appendTextFileImplementation(...args);
}
