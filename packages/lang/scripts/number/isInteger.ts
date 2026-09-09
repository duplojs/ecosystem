import type { Integer } from "./constraints";

export function isInteger<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Integer;

export function isInteger(
	number: number,
) {
	return Number.isInteger(number);
}
