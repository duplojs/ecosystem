import type { ReapplyCompatiblesConstraints } from "./constraints";

type ReverseOutput<
	GenericArray extends readonly unknown[],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly GenericArray[number][]
	>
	: never;

export function reverse<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): ReverseOutput<GenericArray>;

export function reverse<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): any {
	return array.slice().reverse();
}
