import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import type { Stats } from "node:fs";
import type { FileSystemEither } from "./types";

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

export type StatResult = FileSystemEither<
	| DEither.Right<"stat", StatInfo>
	| DEither.Left<"stat-not-found", unknown>
	| DEither.Left<"stat-permission-denied", unknown>
	| DEither.Left<"stat-not-directory", unknown>
	| DEither.Left<"stat-too-many-open-files", unknown>
	| DEither.Left<"stat-busy", unknown>
	| DEither.Left<"stat-error", unknown>
>;

function handleNodeStatError(error: unknown): StatResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (error.code === "ENOENT") {
			return DEither.left("file-system-stat-not-found", error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-stat-permission-denied", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-stat-not-directory", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-stat-too-many-open-files", error);
		} else if (error.code === "EBUSY") {
			return DEither.left("file-system-stat-busy", error);
		}
	}

	return DEither.left("file-system-stat-error", error);
}

function handleDenoStatError(error: unknown): StatResult {
	if (error instanceof Deno.errors.NotFound) {
		return DEither.left("file-system-stat-not-found", error);
	}

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-stat-permission-denied", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-stat-not-directory", error);
	}

	if (error instanceof Deno.errors.Busy) {
		return DEither.left("file-system-stat-busy", error);
	}

	return DEither.left("file-system-stat-error", error);
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
