import type { ReapplyCompatiblesConstraints } from "../constraints";

type FillOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly (
		| GenericArray[number]
		| GenericValue
		)[]
	>
	: never;

export function fill<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	value: GenericValue,
	start: number,
	end: number,
): (
	array: GenericArray,
) => FillOutput<GenericArray, GenericValue>;

export function fill<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	array: GenericArray,
	value: GenericValue,
	start: number,
	end: number,
): FillOutput<GenericArray, GenericValue>;

export function fill(
	...args:
		| [array: readonly unknown[], value: unknown, start: number, end: number]
		| [value: unknown, start: number, end: number]
): any {
	if (args.length === 3) {
		const [value, start, end] = args;

		return (array: readonly unknown[]) => fill(array, value, start, end);
	}

	const [array, value, start, end] = args;

	return array.slice().fill(value, start, end);
}
