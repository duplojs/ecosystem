import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type RenameResult = FileSystemEither<
	| DEither.Right<"rename", string & DPath.Path>
	| DEither.Left<"rename-not-found", unknown>
	| DEither.Left<"rename-permission-denied", unknown>
	| DEither.Left<"rename-already-exists", unknown>
	| DEither.Left<"rename-is-directory", unknown>
	| DEither.Left<"rename-not-directory", unknown>
	| DEither.Left<"rename-directory-not-empty", unknown>
	| DEither.Left<"rename-read-only", unknown>
	| DEither.Left<"rename-invalid-argument", unknown>
	| DEither.Left<"rename-busy", unknown>
	| DEither.Left<"rename-cross-device", unknown>
	| DEither.Left<"rename-error", unknown>
>;

function handleNodeRenameError(error: unknown): RenameResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-rename-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-rename-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-rename-already-exists", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-rename-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-rename-not-directory", error);
		} else if (error.code === "ENOTEMPTY") {
			return DEither.left("file-system-rename-directory-not-empty", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-rename-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-rename-invalid-argument", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-rename-busy", error);
		} else if (error.code === "EXDEV") {
			return DEither.left("file-system-rename-cross-device", error);
		}
	}

	return DEither.left("file-system-rename-error", error);
}

function handleDenoRenameError(error: unknown): RenameResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-rename-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-rename-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-rename-already-exists", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-rename-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-rename-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-rename-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-rename-busy", error);
	}

	return DEither.left("file-system-rename-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		rename(
			path: string & DPath.Path,
			newName: string & DPath.Segment,
		): Promise<RenameResult>;
	}
}

const renameImplementation = implementFunction(
	"rename",
	{
		NODE: async(path, newName) => {
			const fs = await nodeFileSystem.value;

			const parentPath = DPath.getParentFolderPath(path);

			if (!parentPath) {
				return DEither.left("file-system-rename-invalid-argument", new Error(`Invalid parent path ${path}.`));
			}

			const newPath = DPath.resolveRelative([parentPath, newName]);

			return fs.rename(
				path,
				newPath,
			)
				.then(() => DEither.right("file-system-rename", newPath))
				.catch(handleNodeRenameError);
		},
		DENO: (path, newName) => {
			const parentPath = DPath.getParentFolderPath(path);

			if (!parentPath) {
				return Promise.resolve(DEither.left("file-system-rename-invalid-argument", new Error(`Invalid parent path ${path}.`)));
			}

			const newPath = DPath.resolveRelative([parentPath, newName]);

			return Deno.rename(
				path,
				newPath,
			)
				.then(() => DEither.right("file-system-rename", newPath))
				.catch(handleDenoRenameError);
		},
	},
);

export function rename(
	newName: string & DPath.Segment,
): (
	path: string & DPath.Path,
) => Promise<RenameResult>;

export function rename(
	path: string & DPath.Path,
	newName: string & DPath.Segment,
): Promise<RenameResult>;

export function rename(
	...args:
		| [newName: string & DPath.Segment]
		| [path: string & DPath.Path, newName: string & DPath.Segment]
) {
	if (args.length === 1) {
		const [newName] = args;

		return (path: string & DPath.Path) => renameImplementation(
			path,
			newName,
		);
	}

	return renameImplementation(...args);
}
