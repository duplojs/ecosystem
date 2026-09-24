import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

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

export type SetModeResult = FileSystemEither<
	| DEither.Right<"set-mode", void>
	| DEither.Left<"set-mode-not-found", unknown>
	| DEither.Left<"set-mode-permission-denied", unknown>
	| DEither.Left<"set-mode-not-directory", unknown>
	| DEither.Left<"set-mode-read-only", unknown>
	| DEither.Left<"set-mode-invalid-argument", unknown>
	| DEither.Left<"set-mode-error", unknown>
>;

function handleNodeSetModeError(error: unknown): SetModeResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-set-mode-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-set-mode-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-set-mode-not-directory", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-set-mode-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-set-mode-invalid-argument", error);
		}
	}

	return DEither.left("file-system-set-mode-error", error);
}

function handleDenoSetModeError(error: unknown): SetModeResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-set-mode-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-set-mode-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-set-mode-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-set-mode-invalid-argument", error);
	}

	return DEither.left("file-system-set-mode-error", error);
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
