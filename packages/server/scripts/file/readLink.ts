import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type ReadLinkResult = FileSystemEither<
	| DEither.Right<"read-link", string>
	| DEither.Left<"read-link-not-found", unknown>
	| DEither.Left<"read-link-permission-denied", unknown>
	| DEither.Left<"read-link-invalid-argument", unknown>
	| DEither.Left<"read-link-not-directory", unknown>
	| DEither.Left<"read-link-too-many-open-files", unknown>
	| DEither.Left<"read-link-error", unknown>
>;

function handleNodeReadLinkError(error: unknown): ReadLinkResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-read-link-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-read-link-permission-denied", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-read-link-invalid-argument", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-read-link-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-read-link-too-many-open-files", error);
		}
	}

	return DEither.left("file-system-read-link-error", error);
}

function handleDenoReadLinkError(error: unknown): ReadLinkResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-read-link-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-read-link-permission-denied", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-read-link-invalid-argument", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-read-link-not-directory", error);
	}

	return DEither.left("file-system-read-link-error", error);
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
