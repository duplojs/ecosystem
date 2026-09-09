
import type * as DString from "@scripts/string";
import type { Absolute, Path } from "./constraints";
import { type IsLiteralPath } from "./types";

const dotSegmentRegExp = /(^|\/)\.(\/|$)/;
const endsWithSlash = /[^]+\/$/;
const dotDotRegExp = /(^|\/)\.\.(\/|$)/;
const invalidDotDotRegExp = /(^|\/)(?!\.\.(?:\/|$))[^/]+\/\.\.(?:\/|$)/;

export function is<
	GenericPath extends string,
>(
	value: GenericPath,
): value is (
	GenericPath extends (Path | Absolute)
		? GenericPath
		: IsLiteralPath<GenericPath> extends true
			? GenericPath
			: DString.IsLiteral<GenericPath> extends true
				? never
				: GenericPath & Path
);

export function is(
	value: string,
) {
	if (value === ".") {
		return true;
	}

	if (
		value === ""
		|| value.includes("\0")
		|| value.includes("//")
		|| endsWithSlash.test(value)
		|| dotSegmentRegExp.test(value)
	) {
		return false;
	}

	if (value.startsWith("/")) {
		return !dotDotRegExp.test(value);
	}

	return !invalidDotDotRegExp.test(value);
}
