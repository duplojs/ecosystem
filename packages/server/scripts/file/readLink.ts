import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class ReadLinkErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-read-link-not-found", Error) {}
class ReadLinkErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-link-permission-denied", Error) {}
class ReadLinkErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-read-link-invalid-argument", Error) {}
class ReadLinkErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-read-link-not-directory", Error) {}
class ReadLinkErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-read-link-too-many-open-files", Error) {}
class ReadLinkError extends DCommon.DuploJSError.parentClass("file-system-read-link-error", Error) {}

export type ReadLinkErrors = (
	| ReadLinkErrorNotFound
	| ReadLinkErrorPermissionDenied
	| ReadLinkErrorInvalidArgument
	| ReadLinkErrorNotDirectory
	| ReadLinkErrorTooManyOpenFiles
	| ReadLinkError
);

export type ReadLinkResult = (
	| DEither.Right<"file-system-read-link", string>
	| DEither.Left<"file-system-read-link-error", ReadLinkErrors>
);

function handleNodeReadLinkError(error: Error) {
	let readLinkError: ReadLinkErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			readLinkError = new ReadLinkErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			readLinkError = new ReadLinkErrorPermissionDenied(error);
		} else if (error.code === "EINVAL") {
			readLinkError = new ReadLinkErrorInvalidArgument(error);
		} else if (error.code === "ENOTDIR") {
			readLinkError = new ReadLinkErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			readLinkError = new ReadLinkErrorTooManyOpenFiles(error);
		}
	}

	if (readLinkError === undefined) {
		readLinkError = new ReadLinkError(error);
	}

	return DEither.left("file-system-read-link-error", readLinkError);
}

function handleDenoReadLinkError(error: Error) {
	let readLinkError: ReadLinkErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		readLinkError = new ReadLinkErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		readLinkError = new ReadLinkErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		readLinkError = new ReadLinkErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		readLinkError = new ReadLinkErrorNotDirectory(error);
	}

	if (readLinkError === undefined) {
		readLinkError = new ReadLinkError(error);
	}

	return DEither.left("file-system-read-link-error", readLinkError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readLink(path: string & DPath.Path): Promise<ReadLinkResult>;
	}
}

export const readLink = implementFunction(
	"readLink",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.readlink(
				path,
				{ encoding: "utf-8" },
			)
				.then((value) => DEither.right("file-system-read-link", value))
				.catch(handleNodeReadLinkError);
		},
		DENO: (path) => Deno
			.readLink(path)
			.then((value) => DEither.right("file-system-read-link", value))
			.catch(handleDenoReadLinkError),
	},
);
