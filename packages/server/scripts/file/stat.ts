import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { Stats } from "node:fs";

export interface StatInfo {

	/** Type of entry */
	isFile: boolean;
	isDirectory: boolean;
	isSymlink: boolean;

	/** Size in bytes */
	sizeBytes: number;

	/** Timestamps */
	modifiedAt: DChrono.TheDate | null;
	accessedAt: DChrono.TheDate | null;
	createdAt: DChrono.TheDate | null;
	changedAt: DChrono.TheDate | null;

	/** Unix/FS identifiers */
	deviceId: number;
	inode: number | null;
	permissionsMode: number | null;
	hardLinkCount: number | null;

	/** Ownership */
	ownerUserId: number | null;
	ownerGroupId: number | null;

	/** Special device id (if file is a device) */
	specialDeviceId: number | null;

	/** FS allocation */
	ioBlockSize: number | null;
	allocatedBlockCount: number | null;

	/** Special file kinds */
	isBlockDevice: boolean | null;
	isCharacterDevice: boolean | null;
	isFifo: boolean | null;
	isSocket: boolean | null;
}

class StatErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-stat-not-found", Error) {}
class StatErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-stat-permission-denied", Error) {}
class StatErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-stat-not-directory", Error) {}
class StatErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-stat-too-many-open-files", Error) {}
class StatErrorBusy extends DCommon.DuploJSError.parentClass("file-system-stat-busy", Error) {}
class StatError extends DCommon.DuploJSError.parentClass("file-system-stat-error", Error) {}

type StatErrors = (
	| StatErrorNotFound
	| StatErrorPermissionDenied
	| StatErrorNotDirectory
	| StatErrorTooManyOpenFiles
	| StatErrorBusy
	| StatError
);

export type StatResult = (
	| DEither.Right<"file-system-stat", StatInfo>
	| DEither.Left<"file-system-stat-error", StatErrors>
);

function handleNodeStatError(error: Error) {
	let statError: StatErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			statError = new StatErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			statError = new StatErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			statError = new StatErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			statError = new StatErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			statError = new StatErrorBusy(error);
		}
	}

	if (statError === undefined) {
		statError = new StatError(error);
	}

	return DEither.left("file-system-stat-error", statError);
}

function handleDenoStatError(error: Error) {
	let statError: StatErrors | undefined = undefined;

	if (error instanceof Deno.errors.NotFound) {
		statError = new StatErrorNotFound(error);
	} else if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		statError = new StatErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		statError = new StatErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.Busy) {
		statError = new StatErrorBusy(error);
	}

	if (statError === undefined) {
		statError = new StatError(error);
	}

	return DEither.left("file-system-stat-error", statError);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		stat(path: string & DPath.Path): Promise<StatResult>;
	}
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

export const stat = implementFunction(
	"stat",
	{
		NODE: async(path) => {
			const fs = await nodeFileSystem.value;
			return fs.stat(path)
				.then(
					DCommon.innerPipe(
						createStatInfoWithFsSource,
						(value) => DEither.right("file-system-stat", value),
					),
				)
				.catch(handleNodeStatError);
		},
		DENO: (path) => Deno
			.stat(path)
			.then(
				DCommon.innerPipe(
					createStatInfoWithDeno,
					(value) => DEither.right("file-system-stat", value),
				),
			)
			.catch(handleDenoStatError),
		BUN: (path) => Bun.file(path)
			.stat()
			.then(
				DCommon.innerPipe(
					createStatInfoWithFsSource,
					(value) => DEither.right("file-system-stat", value),
				),
			)
			.catch(handleNodeStatError),
	},
);
