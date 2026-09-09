import type * as DCommon from "@scripts/common";
import type { ReapplyCompatiblesConstraints } from "./constraints";

type SortOutput<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly GenericElement[]
	>
	: never;

export function sort<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number] = GenericArray[number],
>(
	compareFunction: (
		first: GenericElement,
		second: GenericElement,
	) => number,
): (
	array: GenericArray,
) => SortOutput<GenericArray, GenericElement>;

export function sort<
	GenericArray extends readonly unknown[],
	GenericElement extends GenericArray[number] = GenericArray[number],
>(
	array: GenericArray,
	compareFunction: (
		first: GenericElement,
		second: GenericElement,
	) => number,
): SortOutput<GenericArray, GenericElement>;

export function sort(
	...args:
		| [compareFunction: DCommon.AnyFunction]
		| [array: readonly unknown[], compareFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [compareFunction] = args;

		return (array: readonly unknown[]) => sort(array, compareFunction);
	}

	const [array, compareFunction] = args;

	return array.slice().sort(compareFunction);
}
