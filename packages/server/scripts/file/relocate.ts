import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type RelocateResult = FileSystemEither<
	| DEither.Right<"relocate", string & DPath.Path>
	| DEither.Left<"relocate-not-found", unknown>
	| DEither.Left<"relocate-permission-denied", unknown>
	| DEither.Left<"relocate-already-exists", unknown>
	| DEither.Left<"relocate-is-directory", unknown>
	| DEither.Left<"relocate-not-directory", unknown>
	| DEither.Left<"relocate-directory-not-empty", unknown>
	| DEither.Left<"relocate-read-only", unknown>
	| DEither.Left<"relocate-invalid-argument", unknown>
	| DEither.Left<"relocate-busy", unknown>
	| DEither.Left<"relocate-cross-device", unknown>
	| DEither.Left<"relocate-error", unknown>
>;

function handleNodeRelocateError(error: unknown): RelocateResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-relocate-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-relocate-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-relocate-already-exists", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-relocate-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-relocate-not-directory", error);
		} else if (error.code === "ENOTEMPTY") {
			return DEither.left("file-system-relocate-directory-not-empty", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-relocate-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-relocate-invalid-argument", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-relocate-busy", error);
		} else if (error.code === "EXDEV") {
			return DEither.left("file-system-relocate-cross-device", error);
		}
	}

	return DEither.left("file-system-relocate-error", error);
}

function handleDenoRelocateError(error: unknown): RelocateResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-relocate-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-relocate-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-relocate-already-exists", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-relocate-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-relocate-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-relocate-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-relocate-busy", error);
	}

	return DEither.left("file-system-relocate-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		relocate(
			fromPath: string & DPath.Path,
			toPath: string & DPath.Path,
		): Promise<RelocateResult>;
	}
}

const relocateImplementation = implementFunction(
	"relocate",
	{
		NODE: async(fromPath, newParentPath) => {
			const fs = await nodeFileSystem.value;
			const baseName = DPath.getBaseName(fromPath);

			if (!baseName) {
				return DEither.left("file-system-relocate-invalid-argument", new Error(`Invalid base name ${fromPath}`));
			}

			const newPath = DPath.resolveRelative([newParentPath, baseName]);

			return fs.rename(
				fromPath,
				newPath,
			)
				.then(() => DEither.right("file-system-relocate", newPath))
				.catch(handleNodeRelocateError);
		},
		DENO: (fromPath, newParentPath) => {
			const baseName = DPath.getBaseName(fromPath);

			if (!baseName) {
				return Promise.resolve(DEither.left("file-system-relocate-invalid-argument", new Error(`Invalid base name ${fromPath}`)));
			}

			const newPath = DPath.resolveRelative([newParentPath, baseName]);

			return Deno.rename(
				fromPath,
				newPath,
			)
				.then(() => DEither.right("file-system-relocate", newPath))
				.catch(handleDenoRelocateError);
		},
	},
);

export function relocate(
	toPath: string & DPath.Path,
): (
	fromPath: string & DPath.Path,
) => Promise<RelocateResult>;

export function relocate(
	fromPath: string & DPath.Path,
	toPath: string & DPath.Path,
): Promise<RelocateResult>;

export function relocate(
	...args:
		| [toPath: string & DPath.Path]
		| [fromPath: string & DPath.Path, toPath: string & DPath.Path]
) {
	if (args.length === 1) {
		const [toPath] = args;

		return (fromPath: string & DPath.Path) => relocateImplementation(
			fromPath,
			toPath,
		);
	}

	return relocateImplementation(...args);
}
