import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { StatInfo } from "./stat";
import type { Stats } from "node:fs";
import type { FileSystemEither } from "./types";

export type LinkStatResult = FileSystemEither<
	| DEither.Right<"link-stat", StatInfo>
	| DEither.Left<"link-stat-not-found", unknown>
	| DEither.Left<"link-stat-permission-denied", unknown>
	| DEither.Left<"link-stat-not-directory", unknown>
	| DEither.Left<"link-stat-too-many-open-files", unknown>
	| DEither.Left<"link-stat-busy", unknown>
	| DEither.Left<"link-stat-error", unknown>
>;

function handleNodeLinkStatError(error: unknown): LinkStatResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-link-stat-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-link-stat-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-link-stat-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-link-stat-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-link-stat-busy", error);
		}
	}

	return DEither.left("file-system-link-stat-error", error);
}

function handleDenoLinkStatError(error: unknown): LinkStatResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-link-stat-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-link-stat-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-link-stat-not-directory", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-link-stat-busy", error);
	}

	return DEither.left("file-system-link-stat-error", error);
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
