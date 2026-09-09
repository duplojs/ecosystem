import type { Even } from "./constraints";

export function isEven<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & Even;

export function isEven(
	number: number,
) {
	return number % 2 === 0;
}
