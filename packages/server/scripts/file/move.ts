import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type MoveResult = FileSystemEither<
	| DEither.Right<"move", void>
	| DEither.Left<"move-not-found", unknown>
	| DEither.Left<"move-permission-denied", unknown>
	| DEither.Left<"move-already-exists", unknown>
	| DEither.Left<"move-is-directory", unknown>
	| DEither.Left<"move-not-directory", unknown>
	| DEither.Left<"move-directory-not-empty", unknown>
	| DEither.Left<"move-read-only", unknown>
	| DEither.Left<"move-invalid-argument", unknown>
	| DEither.Left<"move-busy", unknown>
	| DEither.Left<"move-cross-device", unknown>
	| DEither.Left<"move-error", unknown>
>;

function handleNodeMoveError(error: unknown): MoveResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-move-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-move-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-move-already-exists", error);
		} else if (error.code === "EISDIR") {
			return DEither.left("file-system-move-is-directory", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-move-not-directory", error);
		} else if (error.code === "ENOTEMPTY") {
			return DEither.left("file-system-move-directory-not-empty", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-move-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-move-invalid-argument", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-move-busy", error);
		} else if (error.code === "EXDEV") {
			return DEither.left("file-system-move-cross-device", error);
		}
	}

	return DEither.left("file-system-move-error", error);
}

function handleDenoMoveError(error: unknown): MoveResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-move-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-move-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-move-already-exists", error);
	}

	if (error instanceof Deno.errors.IsADirectory) {
		return DEither.left("file-system-move-is-directory", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-move-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-move-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-move-busy", error);
	}

	return DEither.left("file-system-move-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		move(
			fromPath: string & DPath.Path,
			toPath: string & DPath.Path,
		): Promise<MoveResult>;
	}
}

const moveImplementation = implementFunction(
	"move",
	{
		NODE: async(fromPath, toPath) => {
			const fs = await nodeFileSystem.value;
			return fs.rename(
				fromPath,
				toPath,
			)
				.then(() => DEither.right("file-system-move"))
				.catch(handleNodeMoveError);
		},
		DENO: (fromPath, toPath) => Deno.rename(
			fromPath,
			toPath,
		)
			.then(() => DEither.right("file-system-move"))
			.catch(handleDenoMoveError),
	},
);

export function move(
	toPath: string & DPath.Path,
): (
	fromPath: string & DPath.Path,
) => Promise<MoveResult>;

export function move(
	fromPath: string & DPath.Path,
	toPath: string & DPath.Path,
): Promise<MoveResult>;

export function move(
	...args:
		| [toPath: string & DPath.Path]
		| [fromPath: string & DPath.Path, toPath: string & DPath.Path]
) {
	if (args.length === 1) {
		const [toPath] = args;

		return (fromPath: string & DPath.Path) => moveImplementation(
			fromPath,
			toPath,
		);
	}

	return moveImplementation(...args);
}
