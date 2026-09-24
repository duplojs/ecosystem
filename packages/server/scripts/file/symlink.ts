import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export interface SymlinkParams {

	/**
	 * @remarks
	 * Specify the symbolic link type as file, directory or NTFS junction.
	 * This option only applies to Windows and is ignored on other operating systems.
	 */
	type: "file" | "dir" | "junction";
}

export type SymlinkResult = FileSystemEither<
	| DEither.Right<"symlink", void>
	| DEither.Left<"symlink-not-found", unknown>
	| DEither.Left<"symlink-permission-denied", unknown>
	| DEither.Left<"symlink-already-exists", unknown>
	| DEither.Left<"symlink-not-directory", unknown>
	| DEither.Left<"symlink-read-only", unknown>
	| DEither.Left<"symlink-invalid-argument", unknown>
	| DEither.Left<"symlink-too-many-open-files", unknown>
	| DEither.Left<"symlink-busy", unknown>
	| DEither.Left<"symlink-error", unknown>
>;

function handleNodeSymlinkError(error: unknown): SymlinkResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-symlink-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-symlink-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-symlink-already-exists", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-symlink-not-directory", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-symlink-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-symlink-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-symlink-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-symlink-busy", error);
		}
	}

	return DEither.left("file-system-symlink-error", error);
}

function handleDenoSymlinkError(error: unknown): SymlinkResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-symlink-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-symlink-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-symlink-already-exists", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-symlink-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-symlink-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-symlink-busy", error);
	}

	return DEither.left("file-system-symlink-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		symlink(
			oldPath: string & DPath.Path,
			newPath: string & DPath.Path,
			params?: SymlinkParams
		): Promise<SymlinkResult>;
	}
}

const symlinkImplementation = implementFunction(
	"symlink",
	{
		NODE: async(oldPath, newPath, params) => {
			const fs = await nodeFileSystem.value;
			return fs.symlink(
				oldPath,
				newPath,
				params?.type,
			)
				.then(() => DEither.right("file-system-symlink"))
				.catch(handleNodeSymlinkError);
		},
		DENO: (oldPath, newPath, params) => Deno
			.symlink(
				oldPath,
				newPath,
				params,
			)
			.then(() => DEither.right("file-system-symlink"))
			.catch(handleDenoSymlinkError),
	},
);

export function symlink(
	newPath: string & DPath.Path,
): (
	oldPath: string & DPath.Path,
) => Promise<SymlinkResult>;

export function symlink(
	oldPath: string & DPath.Path,
	newPath: string & DPath.Path,
	params?: SymlinkParams,
): Promise<SymlinkResult>;

export function symlink(
	...args:
		| [newPath: string & DPath.Path]
		| [oldPath: string & DPath.Path, newPath: string & DPath.Path, params?: SymlinkParams]
) {
	if (args.length === 1) {
		const [newPath] = args;

		return (oldPath: string & DPath.Path) => symlinkImplementation(
			oldPath,
			newPath,
		);
	}

	return symlinkImplementation(...args);
}
