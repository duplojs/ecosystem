import type { ReapplyCompatiblesConstraints } from "./constraints";

type ShiftOutput<
	GenericArray extends readonly unknown[],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly GenericArray[number][],
		"maxElements"
	>
	: never;

export function shift<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): ShiftOutput<GenericArray>;

export function shift(
	array: readonly unknown[],
): any {
	return array.slice(1);
}
