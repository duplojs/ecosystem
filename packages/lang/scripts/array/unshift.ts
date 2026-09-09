import type { ReapplyCompatiblesConstraints } from "./constraints";

type UnshiftOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[] = [],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly (
			| GenericValue
			| GenericValuesRest[number]
			| GenericArray[number]
		)[],
		"minElements"
	>
	: never;

export function unshift<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	value: GenericValue,
): (
	array: GenericArray,
) => UnshiftOutput<GenericArray, GenericValue>;

export function unshift<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[],
>(
	array: GenericArray,
	value: GenericValue,
	...valuesRest: GenericValuesRest
): UnshiftOutput<GenericArray, GenericValue, GenericValuesRest>;

export function unshift(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown, ...valuesRest: readonly unknown[]]
): any {
	if (args.length === 1) {
		const [value] = args as [unknown];

		return (array: readonly unknown[]) => unshift(array, value);
	}

	const [array, ...values] = args as [unknown[], unknown, ...unknown[]];

	// Use a loop if spread inputs can become large.
	return [...values, ...array];
}
