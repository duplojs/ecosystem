import type { Absolute, Path, Segment } from "./constraints";
import { isSegment } from "./isSegment";

const basenameRegex = /([^/]+)$/;

export interface GetExtensionNameParams {
	withDot?: boolean;
}

export function getExtensionName<
	GenericPath extends string & (Path | Absolute | Segment),
>(
	path: GenericPath,
	params?: GetExtensionNameParams,
): (string & Segment) | null;

export function getExtensionName(
	path: string,
	params?: GetExtensionNameParams,
): any {
	const baseName = basenameRegex.exec(path)?.[1];

	if (
		!baseName
		|| baseName === "."
		|| baseName === ".."
	) {
		return null;
	}

	const dotIndex = baseName.lastIndexOf(".");

	if (dotIndex <= 0 || dotIndex === baseName.length - 1) {
		return null;
	}

	const extension = baseName.slice(dotIndex + 1);

	const result = params?.withDot
		? `.${extension}`
		: extension;

	return isSegment(result)
		? result
		: null;
}
