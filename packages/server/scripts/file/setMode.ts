import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";

interface Permissions {
	read?: boolean;
	write?: boolean;
	exec?: boolean;
}

interface ModeObject {
	user?: Permissions;
	group?: Permissions;
	other?: Permissions;

	setUserId?: boolean;
	setGroupId?: boolean;
	sticky?: boolean;
}

type SetMode = ModeObject | number;

class SetModeErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-set-mode-not-found", Error) {}
class SetModeErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-set-mode-permission-denied", Error) {}
class SetModeErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-set-mode-not-directory", Error) {}
class SetModeErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-set-mode-read-only", Error) {}
class SetModeErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-set-mode-invalid-argument", Error) {}
class SetModeError extends DCommon.DuploJSError.parentClass("file-system-set-mode-error", Error) {}

type SetModeErrors = (
	| SetModeErrorNotFound
	| SetModeErrorPermissionDenied
	| SetModeErrorNotDirectory
	| SetModeErrorReadOnly
	| SetModeErrorInvalidArgument
	| SetModeError
);

export type SetModeResult = (
	| DEither.Right<"file-system-set-mode", void>
	| DEither.Left<"file-system-set-mode-error", SetModeErrors>
);

function handleNodeSetModeError(error: Error) {
	let setModeError: SetModeErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			setModeError = new SetModeErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			setModeError = new SetModeErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			setModeError = new SetModeErrorNotDirectory(error);
		} else if (error.code === "EROFS") {
			setModeError = new SetModeErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			setModeError = new SetModeErrorInvalidArgument(error);
		}
	}

	if (setModeError === undefined) {
		setModeError = new SetModeError(error);
	}

	return DEither.left("file-system-set-mode-error", setModeError);
}

function handleDenoSetModeError(error: Error) {
	let setModeError: SetModeErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		setModeError = new SetModeErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		setModeError = new SetModeErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		setModeError = new SetModeErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		setModeError = new SetModeErrorInvalidArgument(error);
	}

	if (setModeError === undefined) {
		setModeError = new SetModeError(error);
	}

	return DEither.left("file-system-set-mode-error", setModeError);
}

function calculatePermissions(permissions?: Permissions): number {
	if (!permissions) {
		return 0;
	}

	return (permissions.read ? 4 : 0)
       + (permissions.write ? 2 : 0)
       + (permissions.exec ? 1 : 0);
}

function toMode(mode: SetMode): number {
	if (DCommon.isType(mode, "number")) {
		return mode;
	}

	const special = (mode.setUserId ? 4 : 0)
                + (mode.setGroupId ? 2 : 0)
                + (mode.sticky ? 1 : 0);

	const user = calculatePermissions(mode.user);
	const group = calculatePermissions(mode.group);
	const other = calculatePermissions(mode.other);

	return (special * 512) + (user * 64) + (group * 8) + other;
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		setMode(
			path: string & DPath.Path,
			mode: SetMode,
		): Promise<SetModeResult>;
	}
}

const setModeImplementation = implementFunction(
	"setMode",
	{
		NODE: async(path, mode) => {
			const fs = await nodeFileSystem.value;
			return fs.chmod(path, toMode(mode))
				.then(() => DEither.right("file-system-set-mode"))
				.catch(handleNodeSetModeError);
		},
		DENO: (path, mode) => Deno
			.chmod(path, toMode(mode))
			.then(() => DEither.right("file-system-set-mode"))
			.catch(handleDenoSetModeError),
	},
);

export function setMode(
	mode: SetMode,
): (
	path: string & DPath.Path,
) => Promise<SetModeResult>;

export function setMode(
	path: string & DPath.Path,
	mode: SetMode,
): Promise<SetModeResult>;

export function setMode(
	...args:
		| [mode: SetMode]
		| [path: string & DPath.Path, mode: SetMode]
) {
	if (args.length === 1) {
		const [mode] = args;

		return (path: string & DPath.Path) => setModeImplementation(
			path,
			mode,
		);
	}

	return setModeImplementation(...args);
}
