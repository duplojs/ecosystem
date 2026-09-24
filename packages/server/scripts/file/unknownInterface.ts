import type * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
import { createKind } from "@scripts/kind";
import { stat, type StatResult } from "./stat";
import { exists, type ExistsResult } from "./exists";

const unknownInterfaceKind = createKind("unknownInterface");

export interface UnknownInterface extends DKind.Kind<
	typeof unknownInterfaceKind
> {
	path: string & DPath.Path;
	getName(): (string & DPath.Segment) | null;
	getParentPath(): (string & DPath.Path) | null;
	stat(): Promise<StatResult>;
	exist(): Promise<ExistsResult>;
}

export function createUnknownInterface(path: string & DPath.Path): UnknownInterface {
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
	} satisfies DKind.Remove<UnknownInterface> as never;
}

export function isUnknownInterface(
	input: unknown,
): input is UnknownInterface {
	return unknownInterfaceKind.has(input);
}
