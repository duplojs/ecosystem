import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

interface ReadDirectoryParams {
	recursive?: boolean;
}

export type ReadDirectoryResult = FileSystemEither<
	| DEither.Right<"read-directory", (string & DPath.Path)[]>
	| DEither.Left<"read-directory-not-found", unknown>
	| DEither.Left<"read-directory-permission-denied", unknown>
	| DEither.Left<"read-directory-not-directory", unknown>
	| DEither.Left<"read-directory-too-many-open-files", unknown>
	| DEither.Left<"read-directory-busy", unknown>
	| DEither.Left<"read-directory-error", unknown>
>;

function handleNodeReadDirectoryError(error: unknown): ReadDirectoryResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-read-directory-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-read-directory-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-read-directory-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-read-directory-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-read-directory-busy", error);
		}
	}

	return DEither.left("file-system-read-directory-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		readDirectory(
			path: string & DPath.Path,
			params?: ReadDirectoryParams,
		): Promise<ReadDirectoryResult>;
	}
}

export const readDirectory = implementFunction(
	"readDirectory",
	{
		NODE: async(path, params) => {
			const fs = await nodeFileSystem.value;

			return fs.readdir(path, { recursive: params?.recursive })
				.then((value) => DEither.right("file-system-read-directory", value as (string & DPath.Path)[]))
				.catch(handleNodeReadDirectoryError);
		},
	},
);
