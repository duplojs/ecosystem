import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type LinkResult = FileSystemEither<
	| DEither.Right<"link", void>
	| DEither.Left<"link-not-found", unknown>
	| DEither.Left<"link-permission-denied", unknown>
	| DEither.Left<"link-already-exists", unknown>
	| DEither.Left<"link-not-directory", unknown>
	| DEither.Left<"link-no-space", unknown>
	| DEither.Left<"link-read-only", unknown>
	| DEither.Left<"link-invalid-argument", unknown>
	| DEither.Left<"link-too-many-open-files", unknown>
	| DEither.Left<"link-busy", unknown>
	| DEither.Left<"link-cross-device", unknown>
	| DEither.Left<"link-error", unknown>
>;

function handleNodeLinkError(error: unknown): LinkResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-link-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-link-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-link-already-exists", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-link-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-link-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-link-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-link-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-link-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-link-busy", error);
		} else if (error.code === "EXDEV") {
			return DEither.left("file-system-link-cross-device", error);
		}
	}

	return DEither.left("file-system-link-error", error);
}

function handleDenoLinkError(error: unknown): LinkResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-link-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-link-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-link-already-exists", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-link-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-link-invalid-argument", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-link-busy", error);
	}

	return DEither.left("file-system-link-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		link(
			existingPath: string & DPath.Path,
			newPath: string & DPath.Path,
		): Promise<LinkResult>;
	}
}

const linkImplementation = implementFunction(
	"link",
	{
		NODE: async(existingPath, newPath) => {
			const fs = await nodeFileSystem.value;
			return fs.link(
				existingPath,
				newPath,
			)
				.then(() => DEither.right("file-system-link"))
				.catch(handleNodeLinkError);
		},
		DENO: (existingPath, newPath) => Deno
			.link(
				existingPath,
				newPath,
			)
			.then(() => DEither.right("file-system-link"))
			.catch(handleDenoLinkError),
	},
);

export function link(
	newPath: string & DPath.Path,
): (
	existingPath: string & DPath.Path,
) => Promise<LinkResult>;

export function link(
	existingPath: string & DPath.Path,
	newPath: string & DPath.Path,
): Promise<LinkResult>;

export function link(
	...args:
		| [newPath: string & DPath.Path]
		| [existingPath: string & DPath.Path, newPath: string & DPath.Path]
) {
	if (args.length === 1) {
		const [newPath] = args;

		return (existingPath: string & DPath.Path) => linkImplementation(
			existingPath,
			newPath,
		);
	}

	return linkImplementation(...args);
}
