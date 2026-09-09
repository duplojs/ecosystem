import type * as DCommon from "@scripts/common";

export interface GroupOutputResult<
	GenericGroupName extends string = string,
	GenericGroupValue extends unknown = unknown,
> {
	group: GenericGroupName;
	value: GenericGroupValue;
}

export function groupOutput<
	GenericGroupValue extends unknown,
	GenericGroupName extends string,
>(
	group: GenericGroupName,
): (
	value: GenericGroupValue,
) => GroupOutputResult<
	GenericGroupName,
	GenericGroupValue
>;

export function groupOutput<
	GenericGroupValue extends unknown,
	GenericGroupName extends string,
>(
	group: GenericGroupName,
	value: GenericGroupValue,
): GroupOutputResult<
	GenericGroupName,
	GenericGroupValue
>;

export function groupOutput(
	...args:
		| [group: string]
		| [group: string, value: unknown]
) {
	if (args.length === 1) {
		const [group] = args;

		return (value: unknown) => groupOutput(group, value);
	}

	const [group, value] = args;

	return {
		group,
		value,
	};
}

export interface GroupTheFunctionParams {
	index: number;
	output: typeof groupOutput;
}

export type GroupResult<
	GenericOutput extends GroupOutputResult,
> = DCommon.SimplifyTopLevel<{
	readonly [Output in GenericOutput as Output["group"]]?: readonly [Output["value"], ...Output["value"][]]
}>;

export function group<
	GenericArray extends readonly unknown[],
	GenericOutput extends GroupOutputResult,
>(
	theFunction: (
		element: GenericArray[number],
		params: GroupTheFunctionParams,
	) => GenericOutput,
): (
	array: GenericArray,
) => GroupResult<GenericOutput>;

export function group<
	GenericElement extends unknown,
	GenericOutput extends GroupOutputResult,
>(
	array: readonly GenericElement[],
	theFunction: (
		element: GenericElement,
		params: GroupTheFunctionParams,
	) => GenericOutput,
): GroupResult<GenericOutput>;

export function group(
	...args:
		| [array: readonly unknown[], theFunction: DCommon.AnyFunction<any, GroupOutputResult>]
		| [theFunction: DCommon.AnyFunction<any, GroupOutputResult>]
): any {
	if (args.length === 1) {
		const [theFunction] = args;
		return (array: readonly unknown[]) => group(array, theFunction);
	}
	const [array, theFunction] = args;

	const result: Record<string, unknown[]> = {};

	for (let index = 0; index < array.length; index++) {
		const { group, value } = theFunction(array[index], {
			index,
			output: groupOutput,
		});

		if (result[group]) {
			result[group].push(value);
		} else {
			result[group] = [value];
		}
	}

	return result;
}
