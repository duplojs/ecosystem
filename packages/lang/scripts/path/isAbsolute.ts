import type * as DString from "@scripts/string";
import type { Absolute } from "./constraints";
import { type IsLiteralAbsolutePath } from "./types";
import { is } from "./is";

export function isAbsolute<
	GenericPath extends string,
>(
	value: GenericPath,
): value is (
	GenericPath extends Absolute
		? GenericPath
		: IsLiteralAbsolutePath<GenericPath> extends true
			? GenericPath
			: DString.IsLiteral<GenericPath> extends true
				? never
				: GenericPath & Absolute
);

export function isAbsolute(
	value: string,
) {
	return value.startsWith("/")
		&& is(value);
}
