import type { NotEmpty } from "./constraints";

export function isNotEmpty<
	GenericValue extends string,
>(
	string: GenericValue,
): string is GenericValue & NotEmpty;

export function isNotEmpty(
	string: string,
) {
	return !(string === "");
}
