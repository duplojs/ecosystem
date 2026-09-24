import * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { createKind } from "@scripts/kind";
import { move, type MoveResult } from "./move";
import { exists, type ExistsResult } from "./exists";
import { rename, type RenameResult } from "./rename";
import { remove, type RemoveResult } from "./remove";
import { readDirectory, type ReadDirectoryResult } from "./readDirectory";
import { stat, type StatInfo, type StatResult } from "./stat";
import { walkDirectory, type WalkDirectoryResult } from "./walkDirectory";
import type { FileInterface } from "./fileInterface";
import type { UnknownInterface } from "./unknownInterface";
import { relocate, type RelocateResult } from "./relocate";

const folderInterfaceKind = createKind("folderInterface");

type FolderInterfaceRenameResult = Exclude<RenameResult, DEither.Right> | DEither.Right<"file-system-rename", FolderInterface>;
type FolderInterfaceRelocateResult = Exclude<RelocateResult, DEither.Right> | DEither.Right<"file-system-relocate", FolderInterface>;
type FolderInterfaceMoveResult = Exclude<MoveResult, DEither.Right> | DEither.Right<"file-system-move", FolderInterface>;

export interface FolderInterface extends DKind.Kind<
	typeof folderInterfaceKind
> {
	path: string & DPath.Path;
	getName(): (string & DPath.Segment) | null;
	getParentPath(): (string & DPath.Path) | null;
	rename(newName: (string & DPath.Segment)): Promise<FolderInterfaceRenameResult>;
	exists(): Promise<ExistsResult>;
	relocate(parentPath: string & DPath.Path): Promise<FolderInterfaceRelocateResult>;
	move(newPath: string & DPath.Path): Promise<FolderInterfaceMoveResult>;
	remove(): Promise<RemoveResult>;
	getChildren(): Promise<ReadDirectoryResult>;
	stat(): Promise<StatResult>;
	walk(): Promise<WalkDirectoryResult>;
}

export function createFolderInterface(path: string & DPath.Path): FolderInterface {
	function getName() {
		return DPath.getBaseName(path);
	}

	function getParentPath() {
		return DPath.getParentFolderPath(path);
	}

	function localRename(newName: string & DPath.Segment) {
		return DCommon.asyncPipe(
			rename(path, newName),
			DEither.whenIsRight(
				DCommon.innerPipe(
					createFolderInterface,
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
					createFolderInterface,
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
					createFolderInterface(newPath),
				),
			),
		);
	}

	function localExists() {
		return exists(path);
	}

	function localRemove() {
		return remove(path);
	}

	function localStat() {
		return stat(path);
	}

	function getChildren() {
		return readDirectory(path);
	}

	function walk() {
		return walkDirectory(path);
	}

	return {
		path,
		getName,
		getParentPath,
		move: localMove,
		rename: localRename,
		exists: localExists,
		relocate: localRelocate,
		remove: localRemove,
		getChildren,
		stat: localStat,
		walk,
		[folderInterfaceKind.runTimeKey]: null,
	} satisfies DKind.Remove<FolderInterface> as never;
}

export function isFolderInterface(
	input: unknown,
): input is FolderInterface {
	return folderInterfaceKind.has(input);
}
