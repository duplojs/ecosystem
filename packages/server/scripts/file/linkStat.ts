import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { StatInfo } from "./stat";
import type { Stats } from "node:fs";

class LinkStatErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-link-stat-not-found", Error) {}
class LinkStatErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-link-stat-permission-denied", Error) {}
class LinkStatErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-link-stat-not-directory", Error) {}
class LinkStatErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-link-stat-too-many-open-files", Error) {}
class LinkStatErrorBusy extends DCommon.DuploJSError.parentClass("file-system-link-stat-busy", Error) {}
class LinkStatError extends DCommon.DuploJSError.parentClass("file-system-link-stat-error", Error) {}

export type LinkStatErrors = (
	| LinkStatErrorNotFound
	| LinkStatErrorPermissionDenied
	| LinkStatErrorNotDirectory
	| LinkStatErrorTooManyOpenFiles
	| LinkStatErrorBusy
	| LinkStatError
);

export type LinkStatResult = (
	| DEither.Right<"file-system-link-stat", StatInfo>
	| DEither.Left<"file-system-link-stat-error", LinkStatErrors>
);

function handleNodeLinkStatError(error: Error) {
	let linkStatError: LinkStatErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			linkStatError = new LinkStatErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			linkStatError = new LinkStatErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			linkStatError = new LinkStatErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			linkStatError = new LinkStatErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			linkStatError = new LinkStatErrorBusy(error);
		}
	}

	if (linkStatError === undefined) {
		linkStatError = new LinkStatError(error);
	}

	return DEither.left("file-system-link-stat-error", linkStatError);
}

function handleDenoLinkStatError(error: Error) {
	let linkStatError: LinkStatErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		linkStatError = new LinkStatErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		linkStatError = new LinkStatErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		linkStatError = new LinkStatErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.Busy) {
		linkStatError = new LinkStatErrorBusy(error);
	}

	if (linkStatError === undefined) {
		linkStatError = new LinkStatError(error);
	}

	return DEither.left("file-system-link-stat-error", linkStatError);
}

function createStatInfoWithFsSource(source: Stats): StatInfo {
	return {
		isFile: source.isFile(),
		isDirectory: source.isDirectory(),
		isSymlink: source.isSymbolicLink(),
		sizeBytes: source.size,
		modifiedAt: DChrono.isSafeTimestamp(source.mtime.getTime())
			? DChrono.createDateOrThrow(source.mtime)
			: null,
		accessedAt: DChrono.isSafeTimestamp(source.atime.getTime())
			? DChrono.createDateOrThrow(source.atime)
			: null,
		createdAt: DChrono.isSafeTimestamp(source.birthtime.getTime())
			? DChrono.createDateOrThrow(source.birthtime)
			: null,
		changedAt: DChrono.isSafeTimestamp(source.ctime.getTime())
			? DChrono.createDateOrThrow(source.ctime)
			: null,
		deviceId: source.dev,
		inode: source.ino,
		permissionsMode: source.mode,
		hardLinkCount: source.nlink,
		ownerUserId: source.uid,
		ownerGroupId: source.gid,
		specialDeviceId: source.rdev,
		ioBlockSize: source.blksize,
		allocatedBlockCount: source.blocks,
		isBlockDevice: source.isBlockDevice(),
		isCharacterDevice: source.isCharacterDevice(),
		isFifo: source.isFIFO(),
		isSocket: source.isSocket(),
	};
}

function createStatInfoWithDeno(source: Deno.FileInfo): StatInfo {
	return {
		isFile: source.isFile,
		isDirectory: source.isDirectory,
		isSymlink: source.isSymlink,
		sizeBytes: source.size,
		modifiedAt: source.mtime
			&& DChrono.isSafeTimestamp(source.mtime.getTime())
			? DChrono.createDateOrThrow(source.mtime)
			: null,
		accessedAt: source.atime
			&& DChrono.isSafeTimestamp(source.atime.getTime())
			? DChrono.createDateOrThrow(source.atime)
			: null,
		createdAt: source.birthtime
			&& DChrono.isSafeTimestamp(source.birthtime.getTime())
			? DChrono.createDateOrThrow(source.birthtime)
			: null,
		changedAt: source.ctime
			&& DChrono.isSafeTimestamp(source.ctime.getTime())
			? DChrono.createDateOrThrow(source.ctime)
			: null,
		deviceId: source.dev,
		inode: source.ino,
		permissionsMode: source.mode,
		hardLinkCount: source.nlink,
		ownerUserId: source.uid,
		ownerGroupId: source.gid,
		specialDeviceId: source.rdev,
		ioBlockSize: source.blksize,
		allocatedBlockCount: source.blocks,
		isBlockDevice: source.isBlockDevice,
		isCharacterDevice: source.isCharDevice,
		isFifo: source.isFifo,
		isSocket: source.isSocket,
	};
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		linkStat(path: string & DPath.Path): Promise<LinkStatResult>;
	}
}

export const linkStat = implementFunction(
	"linkStat",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.lstat(path)
				.then(
					DCommon.innerPipe(
						createStatInfoWithFsSource,
						(value) => DEither.right("file-system-link-stat", value),
					),
				)
				.catch(handleNodeLinkStatError);
		},
		DENO: (path) => Deno
			.lstat(path)
			.then(
				DCommon.innerPipe(
					createStatInfoWithDeno,
					(value) => DEither.right("file-system-link-stat", value),
				),
			)
			.catch(handleDenoLinkStatError),
	},
);
