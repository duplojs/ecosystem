import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type CopyResult = FileSystemEither<
	| DEither.Right<"copy", void>
	| DEither.Left<"copy-not-found", unknown>
	| DEither.Left<"copy-permission-denied", unknown>
	| DEither.Left<"copy-already-exists", unknown>
	| DEither.Left<"copy-not-directory", unknown>
	| DEither.Left<"copy-no-space", unknown>
	| DEither.Left<"copy-read-only", unknown>
	| DEither.Left<"copy-invalid-argument", unknown>
	| DEither.Left<"copy-too-many-open-files", unknown>
	| DEither.Left<"copy-busy", unknown>
	| DEither.Left<"copy-error", unknown>
>;

function handleNodeCopyError(error: unknown): CopyResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-copy-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-copy-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-copy-already-exists", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-copy-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-copy-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-copy-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-copy-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-copy-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-copy-busy", error);
		}
	}

	return DEither.left("file-system-copy-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		copy(
			fromPath: string & DPath.Path,
			toPath: string & DPath.Path,
		): Promise<CopyResult>;
	}
}

const copyImplementation = implementFunction(
	"copy",
	{
		NODE: async(fromPath, toPath) => {
			const fs = await nodeFileSystem.value;
			return fs.cp(
				fromPath,
				toPath,
				{ recursive: true },
			)
				.then(() => DEither.right("file-system-copy"))
				.catch(handleNodeCopyError);
		},
	},
);

export function copy(
	toPath: string & DPath.Path,
): (
	fromPath: string & DPath.Path,
) => Promise<CopyResult>;

export function copy(
	fromPath: string & DPath.Path,
	toPath: string & DPath.Path,
): Promise<CopyResult>;

export function copy(
	...args:
		| [toPath: string & DPath.Path]
		| [fromPath: string & DPath.Path, toPath: string & DPath.Path]
) {
	if (args.length === 1) {
		const [toPath] = args;

		return (fromPath: string & DPath.Path) => copyImplementation(
			fromPath,
			toPath,
		);
	}

	return copyImplementation(...args);
}
