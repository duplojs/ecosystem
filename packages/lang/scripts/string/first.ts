import type { First } from "./types";

export function first<
	GenericString extends string,
>(
	string: GenericString,
): GenericString extends unknown
	? First<GenericString>
	: never;

export function first(
	string: string,
) {
	return string.at(0);
}
