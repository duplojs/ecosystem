import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";

export class LinkErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-link-not-found", Error) {}
export class LinkErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-link-permission-denied", Error) {}
export class LinkErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-link-already-exists", Error) {}
export class LinkErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-link-not-directory", Error) {}
export class LinkErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-link-no-space", Error) {}
export class LinkErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-link-read-only", Error) {}
export class LinkErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-link-invalid-argument", Error) {}
export class LinkErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-link-too-many-open-files", Error) {}
export class LinkErrorBusy extends DCommon.DuploJSError.parentClass("file-system-link-busy", Error) {}
export class LinkErrorCrossDevice extends DCommon.DuploJSError.parentClass("file-system-link-cross-device", Error) {}
export class LinkError extends DCommon.DuploJSError.parentClass("file-system-link-error", Error) {}

export type LinkErrors = (
	| LinkErrorNotFound
	| LinkErrorPermissionDenied
	| LinkErrorAlreadyExists
	| LinkErrorNotDirectory
	| LinkErrorNoSpace
	| LinkErrorReadOnly
	| LinkErrorInvalidArgument
	| LinkErrorTooManyOpenFiles
	| LinkErrorBusy
	| LinkErrorCrossDevice
	| LinkError
);

export type LinkResult = (
	| DEither.Right<"file-system-link", void>
	| DEither.Left<"file-system-link-error", LinkErrors>
);

function handleNodeLinkError(error: Error) {
	let linkError: LinkErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			linkError = new LinkErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			linkError = new LinkErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			linkError = new LinkErrorAlreadyExists(error);
		} else if (error.code === "ENOTDIR") {
			linkError = new LinkErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			linkError = new LinkErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			linkError = new LinkErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			linkError = new LinkErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			linkError = new LinkErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			linkError = new LinkErrorBusy(error);
		} else if (error.code === "EXDEV") {
			linkError = new LinkErrorCrossDevice(error);
		}
	}

	if (linkError === undefined) {
		linkError = new LinkError(error);
	}

	return DEither.left("file-system-link-error", linkError);
}

function handleDenoLinkError(error: Error) {
	let linkError: LinkErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		linkError = new LinkErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		linkError = new LinkErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		linkError = new LinkErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		linkError = new LinkErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		linkError = new LinkErrorInvalidArgument(error);
	} else if (error instanceof Deno.errors.Busy) {
		linkError = new LinkErrorBusy(error);
	}

	if (linkError === undefined) {
		linkError = new LinkError(error);
	}

	return DEither.left("file-system-link-error", linkError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		link(
			existingPath: DPath.AnyPath,
			newPath: DPath.AnyPath,
		): Promise<LinkResult>;
	}
}

const linkImplementation = implementFunction(
	"link",
	{
		NODE: async(existingPath, newPath) => nodeFileSystem.value.link(
			existingPath,
			newPath,
		)
			.then(() => DEither.right("file-system-link"))
			.catch(handleNodeLinkError),
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
	newPath: DPath.AnyPath,
): (
	existingPath: DPath.AnyPath,
) => Promise<LinkResult>;

export function link(
	existingPath: DPath.AnyPath,
	newPath: DPath.AnyPath,
): Promise<LinkResult>;

export function link(
	...args:
		| [newPath: DPath.AnyPath]
		| [existingPath: DPath.AnyPath, newPath: DPath.AnyPath]
) {
	if (args.length === 1) {
		const [newPath] = args;

		return (existingPath: DPath.AnyPath) => linkImplementation(
			existingPath,
			newPath,
		);
	}

	return linkImplementation(...args);
}
