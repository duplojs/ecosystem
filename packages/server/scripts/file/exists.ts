import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

class ExistsErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-exists-not-found", Error) {}
class ExistsErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-exists-permission-denied", Error) {}
class ExistsErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-exists-not-directory", Error) {}
class ExistsErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-exists-too-many-open-files", Error) {}
class ExistsError extends DCommon.DuploJSError.parentClass("file-system-exists-error", Error) {}

export type ExistsErrors = (
	| ExistsErrorNotFound
	| ExistsErrorPermissionDenied
	| ExistsErrorNotDirectory
	| ExistsErrorTooManyOpenFiles
	| ExistsError
);

export type ExistsResult = (
	| DEither.Right<"file-system-exists", void>
	| DEither.Left<"file-system-exists-error", ExistsErrors>
);

function handleNodeExistsError(error: Error) {
	let existsError: ExistsErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			existsError = new ExistsErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			existsError = new ExistsErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			existsError = new ExistsErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			existsError = new ExistsErrorTooManyOpenFiles(error);
		}
	}

	if (existsError === undefined) {
		existsError = new ExistsError(error);
	}

	return DEither.left("file-system-exists-error", existsError);
}

function handleDenoExistsError(error: Error) {
	let existsError: ExistsErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		existsError = new ExistsErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		existsError = new ExistsErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		existsError = new ExistsErrorNotDirectory(error);
	}

	if (existsError === undefined) {
		existsError = new ExistsError(error);
	}

	return DEither.left("file-system-exists-error", existsError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		exists(path: string & DPath.Path): Promise<ExistsResult>;
	}
}

export const exists = implementFunction(
	"exists",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.access(path)
				.then(() => DEither.right("file-system-exists"))
				.catch(handleNodeExistsError);
		},
		DENO: (path) => Deno
			.stat(path)
			.then(() => DEither.right("file-system-exists"))
			.catch(handleDenoExistsError),
		BUN: (path) => Bun.file(path)
			.exists()
			.then(
				(value) => value
					? DEither.right("file-system-exists")
					: DEither.left(
						"file-system-exists-error",
						new ExistsErrorNotFound(new Error("Path does not exist")),
					),
			)
			.catch(handleNodeExistsError),
	},
);
