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
import { stat, type StatResult } from "./stat";
import { walkDirectory, type WalkDirectoryParams, type WalkDirectoryResult } from "./walkDirectory";
import { relocate, type RelocateResult } from "./relocate";

const folderInterfaceKind = createKind("folderInterface");

type FolderInterfaceRenameResult = Exclude<RenameResult, DEither.Right> | DEither.Right<"file-system-rename", FolderInterface>;
type FolderInterfaceRelocateResult = Exclude<RelocateResult, DEither.Right> | DEither.Right<"file-system-relocate", FolderInterface>;
type FolderInterfaceMoveResult = Exclude<MoveResult, DEither.Right> | DEither.Right<"file-system-move", FolderInterface>;

export interface FolderInterface<
	GenericPath extends DPath.AnyPath = DPath.AnyPath,
> extends DKind.Kind<
	typeof folderInterfaceKind
	> {
	path: GenericPath & DPath.Path;
	getName(): (string & DPath.Segment & DPath.Path) | null;
	getParentPath(): ReturnType<typeof DPath.getParentFolderPath<GenericPath>>;
	rename(newName: (string & DPath.Segment)): Promise<FolderInterfaceRenameResult>;
	exists(): Promise<ExistsResult>;
	relocate(parentPath: DPath.AnyPath): Promise<FolderInterfaceRelocateResult>;
	move(newPath: DPath.AnyPath): Promise<FolderInterfaceMoveResult>;
	remove(): Promise<RemoveResult>;
	getChildren(): Promise<ReadDirectoryResult>;
	stat(): Promise<StatResult>;
	walk(params?: WalkDirectoryParams): Promise<WalkDirectoryResult>;
	isFolder(): Promise<boolean>;
}

export function createFolderInterface<
	GenericPath extends DPath.AnyPath = DPath.AnyPath,
>(
	path: GenericPath,
): FolderInterface<GenericPath>;

export function createFolderInterface(
	path: DPath.AnyPath,
): FolderInterface {
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

	function localRelocate(newParentPath: DPath.AnyPath) {
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

	function localMove(newPath: DPath.AnyPath) {
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

	function walk(params?: WalkDirectoryParams) {
		return walkDirectory(path, params);
	}

	function isFolder() {
		return DCommon.asyncPipe(
			localStat(),
			DEither.whenHasInformationOtherwise(
				"file-system-stat",
				({ isDirectory }) => isDirectory,
				DCommon.justReturn(false),
			),
		);
	}

	return {
		path: DCommon.cast(path),
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
		isFolder,
		[folderInterfaceKind.runTimeKey]: null,
	} satisfies DKind.Remove<FolderInterface> as never;
}

export function isFolderInterface<
	GenericInput extends unknown,
>(
	input: GenericInput,
): input is Extract<
	GenericInput,
	FolderInterface
> {
	return folderInterfaceKind.has(input);
}

export const isFolderInterfaceFromUnknown: (input: unknown) => input is FolderInterface = isFolderInterface;
