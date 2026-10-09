import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

export interface SetOwnerParams {
	userId: number;
	groupId: number;
}

class SetOwnerErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-set-owner-not-found", Error) {}
class SetOwnerErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-set-owner-permission-denied", Error) {}
class SetOwnerErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-set-owner-not-directory", Error) {}
class SetOwnerErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-set-owner-read-only", Error) {}
class SetOwnerErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-set-owner-invalid-argument", Error) {}
class SetOwnerError extends DCommon.DuploJSError.parentClass("file-system-set-owner-error", Error) {}

export type SetOwnerErrors = (
	| SetOwnerErrorNotFound
	| SetOwnerErrorPermissionDenied
	| SetOwnerErrorNotDirectory
	| SetOwnerErrorReadOnly
	| SetOwnerErrorInvalidArgument
	| SetOwnerError
);

export type SetOwnerResult = (
	| DEither.Right<"file-system-set-owner", void>
	| DEither.Left<"file-system-set-owner-error", SetOwnerErrors>
);

function handleNodeSetOwnerError(error: Error) {
	let setOwnerError: SetOwnerErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			setOwnerError = new SetOwnerErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			setOwnerError = new SetOwnerErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			setOwnerError = new SetOwnerErrorNotDirectory(error);
		} else if (error.code === "EROFS") {
			setOwnerError = new SetOwnerErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			setOwnerError = new SetOwnerErrorInvalidArgument(error);
		}
	}

	if (setOwnerError === undefined) {
		setOwnerError = new SetOwnerError(error);
	}

	return DEither.left("file-system-set-owner-error", setOwnerError);
}

function handleDenoSetOwnerError(error: Error) {
	let setOwnerError: SetOwnerErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		setOwnerError = new SetOwnerErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		setOwnerError = new SetOwnerErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		setOwnerError = new SetOwnerErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		setOwnerError = new SetOwnerErrorInvalidArgument(error);
	}

	if (setOwnerError === undefined) {
		setOwnerError = new SetOwnerError(error);
	}

	return DEither.left("file-system-set-owner-error", setOwnerError);
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
