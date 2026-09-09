import type { Absolute, Path, Segment } from "./constraints";
import { isSegment } from "./isSegment";

const baseNameRegex = /([^/]+)$/;
const extensionNameRegex = /(?<!^)\.[^./]+$/;

export interface GetBaseNameParams {
	removeExtension?: boolean;
}

export function getBaseName<
	GenericPath extends string & (Path | Absolute | Segment),
>(
	path: GenericPath,
	params?: GetBaseNameParams,
): (string & Segment) | null;

export function getBaseName(
	path: string,
	params?: GetBaseNameParams,
) {
	const baseName = baseNameRegex.exec(path)?.[1];

	if (baseName === undefined) {
		return null;
	}

	const result = params?.removeExtension
		? baseName.replace(extensionNameRegex, "")
		: baseName;

	return isSegment(result)
		? result
		: null;
}
