import type { ReapplyCompatiblesConstraints } from "./constraints";

type PushOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[] = [],
> = GenericArray extends unknown
	? ReapplyCompatiblesConstraints<
		GenericArray,
		readonly (
			| GenericArray[number]
			| GenericValue
			| GenericValuesRest[number]
		)[],
		"minElements"
	>
	: never;

export function push<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	value: GenericValue,
): (
	array: GenericArray,
) => PushOutput<GenericArray, GenericValue>;

export function push<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[],
>(
	array: GenericArray,
	value: GenericValue,
	...valuesRest: GenericValuesRest
): PushOutput<GenericArray, GenericValue, GenericValuesRest>;

export function push(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown, ...valuesRest: readonly unknown[]]
): any {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => push(array, value);
	}

	const [array, ...values] = args as [unknown[], ...unknown[]];

	const result = array.slice();
	// Use a loop if spread inputs can become large.
	result.push(...values);

	return result;
}
