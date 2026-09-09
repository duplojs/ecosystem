import type { Last } from "./types";

export function last<
	GenericString extends string,
>(
	string: GenericString,
): GenericString extends unknown
	? Last<GenericString>
	: never;

export function last(
	string: string,
) {
	return string.at(-1);
}
