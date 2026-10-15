import type * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
import { createKind } from "@scripts/kind";
import { stat, type StatResult } from "./stat";
import { exists, type ExistsResult } from "./exists";

const unknownInterfaceKind = createKind("unknownInterface");

export type EntryPath = (
	& string
	& (
		| DPath.Path
		| DPath.Absolute
		| DPath.Segment
	)
);

export interface UnknownEntryInterface<
	GenericPath extends EntryPath = EntryPath,
> extends DKind.Kind<
	typeof unknownInterfaceKind
	> {
	path: GenericPath & DPath.Path;
	getName(): (string & DPath.Segment & DPath.Path) | null;
	getParentPath(): (string & DPath.Path) | null;
	stat(): Promise<StatResult>;
	exist(): Promise<ExistsResult>;
}

export function createUnknownEntryInterface<
	GenericPath extends EntryPath = EntryPath,
>(
	path: GenericPath,
): UnknownEntryInterface<GenericPath>;

export function createUnknownEntryInterface(
	path: string & DPath.Path,
): UnknownEntryInterface {
	function getName() {
		return DPath.getBaseName(path);
	}

	function getParentPath() {
		return DPath.getParentFolderPath(path);
	}

	function localStat() {
		return stat(path);
	}

	function exist() {
		return exists(path);
	}

	return {
		path,
		getName,
		getParentPath,
		stat: localStat,
		exist,
		[unknownInterfaceKind.runTimeKey]: null,
	} satisfies DKind.Remove<UnknownEntryInterface> as never;
}

export function isUnknownEntryInterface<
	GenericInput extends unknown,
>(
	input: GenericInput,
): input is Extract<
	GenericInput,
	UnknownEntryInterface
> {
	return unknownInterfaceKind.has(input);
}

export const isUnknownEntryInterfaceFromUnknown: (
	input: unknown,
) => input is UnknownEntryInterface = isUnknownEntryInterface;
