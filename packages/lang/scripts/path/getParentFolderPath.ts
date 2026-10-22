import type { AnyPath } from "./types";
import type { Absolute, Path } from "./constraints";

const parentFolderPathRegex = /^([^]*)\/[^/]+$/;
const onlyParentSegmentsRegex = /^(?:\.\.)(?:\/\.\.)*$/;

export function getParentFolderPath<
	GenericPath extends AnyPath,
>(
	path: GenericPath,
): (
	| (
		& string
		& Path
		& (
			GenericPath extends Absolute
				? Absolute
				: unknown
		)
	)
	| null
);

export function getParentFolderPath(
	path: string,
) {
	if (path === "/") {
		return null;
	}

	if (path === ".") {
		return "..";
	}

	if (onlyParentSegmentsRegex.test(path)) {
		return `${path}/..`;
	}

	const parent = parentFolderPathRegex.exec(path)?.[1];

	if (parent === undefined) {
		return ".";
	}

	if (parent === "") {
		return "/";
	}

	return parent;
}
