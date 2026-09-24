import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export interface SetOwnerParams {
	userId: number;
	groupId: number;
}

export type SetOwnerResult = FileSystemEither<
	| DEither.Right<"set-owner", void>
	| DEither.Left<"set-owner-not-found", unknown>
	| DEither.Left<"set-owner-permission-denied", unknown>
	| DEither.Left<"set-owner-not-directory", unknown>
	| DEither.Left<"set-owner-read-only", unknown>
	| DEither.Left<"set-owner-invalid-argument", unknown>
	| DEither.Left<"set-owner-error", unknown>
>;

function handleNodeSetOwnerError(error: unknown): SetOwnerResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-set-owner-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-set-owner-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-set-owner-not-directory", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-set-owner-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-set-owner-invalid-argument", error);
		}
	}

	return DEither.left("file-system-set-owner-error", error);
}

function handleDenoSetOwnerError(error: unknown): SetOwnerResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-set-owner-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-set-owner-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-set-owner-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-set-owner-invalid-argument", error);
	}

	return DEither.left("file-system-set-owner-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		setOwner(
			path: string & DPath.Path,
			params: SetOwnerParams,
		): Promise<SetOwnerResult>;
	}
}

const setOwnerImplementation = implementFunction(
	"setOwner",
	{
		NODE: async(path, { userId, groupId }) => {
			const fs = await nodeFileSystem.value;
			return fs.chown(path, userId, groupId)
				.then(() => DEither.right("file-system-set-owner"))
				.catch(handleNodeSetOwnerError);
		},
		DENO: (path, { userId, groupId }) => Deno
			.chown(path, userId, groupId)
			.then(() => DEither.right("file-system-set-owner"))
			.catch(handleDenoSetOwnerError),
	},
);

export function setOwner(
	params: SetOwnerParams,
): (
	path: string & DPath.Path,
) => Promise<SetOwnerResult>;

export function setOwner(
	path: string & DPath.Path,
	params: SetOwnerParams,
): Promise<SetOwnerResult>;

export function setOwner(
	...args:
		| [params: SetOwnerParams]
		| [path: string & DPath.Path, params: SetOwnerParams]
) {
	if (args.length === 1) {
		const [params] = args;

		return (path: string & DPath.Path) => setOwnerImplementation(
			path,
			params,
		);
	}

	return setOwnerImplementation(...args);
}
