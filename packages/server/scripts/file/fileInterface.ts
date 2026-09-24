import * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { createKind } from "@scripts/kind";
import { rename, type RenameResult } from "./rename";
import { exists, type ExistsResult } from "./exists";
import { move, type MoveResult } from "./move";
import { remove, type RemoveResult } from "./remove";
import { type StatInfo, stat, type StatResult } from "./stat";
import { relocate, type RelocateResult } from "./relocate";

const fileInterfaceKind = createKind("fileInterface");

type FileInterfaceRenameResult = Exclude<RenameResult, DEither.Right> | DEither.Right<"file-system-rename", FileInterface>;
type FileInterfaceRelocateResult = Exclude<RelocateResult, DEither.Right> | DEither.Right<"file-system-relocate", FileInterface>;
type FileInterfaceMoveResult = Exclude<MoveResult, DEither.Right> | DEither.Right<"file-system-move", FileInterface>;

export interface FileInterface extends DKind.Kind<
	typeof fileInterfaceKind
> {
	path: string & DPath.Path;
	getName(): (string & DPath.Segment) | null;
	getMimeType(): string | null;
	getExtension(params?: DPath.GetExtensionNameParams): (string & DPath.Segment) | null;
	getParentPath(): (string & DPath.Path) | null;
	rename(newName: string & DPath.Segment): Promise<FileInterfaceRenameResult>;
	relocate(parentPath: string & DPath.Path): Promise<FileInterfaceRelocateResult>;
	move(newPath: string & DPath.Path): Promise<FileInterfaceMoveResult>;
	exists(): Promise<ExistsResult>;
	remove(): Promise<RemoveResult>;
	stat(): Promise<StatResult>;
}

export function createFileInterface(
	path: string & DPath.Path,
): FileInterface {
	function getName() {
		return DPath.getBaseName(path);
	}

	function getExtension(params?: DPath.GetExtensionNameParams) {
		return DPath.getExtensionName(path, params);
	}

	function getMimeType() {
		const extension = getExtension();

		if (!extension) {
			return null;
		}

		return DCommon.mimeType.get(extension) ?? null;
	}

	function getParentPath() {
		return DPath.getParentFolderPath(path);
	}

	function localExists() {
		return exists(path);
	}

	function localRename(newName: string & DPath.Segment) {
		return DCommon.asyncPipe(
			rename(path, newName),
			DEither.whenIsRight(
				DCommon.innerPipe(
					createFileInterface,
					(value) => DEither.right("file-system-rename", value),
				),
			),
		);
	}

	function localRelocate(newParentPath: string & DPath.Path) {
		return DCommon.asyncPipe(
			relocate(path, newParentPath),
			DEither.whenIsRight(
				DCommon.innerPipe(
					createFileInterface,
					(value) => DEither.right("file-system-relocate", value),
				),
			),
		);
	}

	function localMove(newPath: string & DPath.Path) {
		return DCommon.asyncPipe(
			move(path, newPath),
			DEither.whenIsRight(
				() => DEither.right(
					"file-system-move",
					createFileInterface(newPath),
				),
			),
		);
	}

	function localRemove() {
		return remove(path);
	}

	function localStat() {
		return stat(path);
	}

	return {
		path,
		getName,
		getExtension,
		getMimeType,
		getParentPath,
		rename: localRename,
		exists: localExists,
		relocate: localRelocate,
		remove: localRemove,
		move: localMove,
		stat: localStat,
		[fileInterfaceKind.runTimeKey]: null,
	} satisfies DKind.Remove<FileInterface> as never;
}

export function isFileInterface(
	input: unknown,
): input is FileInterface {
	return fileInterfaceKind.has(input);
}
