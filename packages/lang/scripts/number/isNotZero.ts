import type { NotZero } from "./constraints";

export function isNotZero<
	GenericNumber extends number,
>(
	number: GenericNumber,
): number is GenericNumber & NotZero;

export function isNotZero(
	number: number,
) {
	return number !== 0;
}
