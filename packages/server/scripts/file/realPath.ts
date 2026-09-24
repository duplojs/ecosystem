import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type RealPathResult = FileSystemEither<
	| DEither.Right<"real-path", string>
	| DEither.Left<"real-path-not-found", unknown>
	| DEither.Left<"real-path-permission-denied", unknown>
	| DEither.Left<"real-path-not-directory", unknown>
	| DEither.Left<"real-path-too-many-open-files", unknown>
	| DEither.Left<"real-path-error", unknown>
>;

function handleNodeRealPathError(error: unknown): RealPathResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-real-path-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-real-path-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-real-path-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-real-path-too-many-open-files", error);
		}
	}

	return DEither.left("file-system-real-path-error", error);
}

function handleDenoRealPathError(error: unknown): RealPathResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-real-path-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-real-path-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-real-path-not-directory", error);
	}

	return DEither.left("file-system-real-path-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		realPath(
			path: string & DPath.Path,
		): Promise<RealPathResult>;
	}
}

export const realPath = implementFunction(
	"realPath",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.realpath(path)
				.then((value) => DEither.right("file-system-real-path", value))
				.catch(handleNodeRealPathError);
		},
		DENO: (path) => Deno
			.realPath(path)
			.then((value) => DEither.right("file-system-real-path", value))
			.catch(handleDenoRealPathError),
	},
);
