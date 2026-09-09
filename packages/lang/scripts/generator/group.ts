import type * as DCommon from "@scripts/common";

export interface GroupOutputResult<
	GenericGroupName extends string = string,
	GenericGroupValue extends unknown = unknown,
> {
	group: GenericGroupName;
	value: GenericGroupValue;
}

export function groupOutput<
	const GenericGroupName extends string,
	GenericGroupValue extends unknown,
>(
	group: GenericGroupName,
): (
	value: GenericGroupValue,
) => GroupOutputResult<
	GenericGroupName,
	GenericGroupValue
>;

export function groupOutput<
	const GenericGroupName extends string,
	GenericGroupValue extends unknown,
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
	readonly [Output in GenericOutput as Output["group"]]?:
	readonly [Output["value"], ...Output["value"][]]
}>;

export function group<
	GenericItem extends unknown,
	GenericOutput extends GroupOutputResult,
>(
	theFunction: (
		item: GenericItem,
		params: GroupTheFunctionParams,
	) => GenericOutput,
): (
	iterator: Iterable<GenericItem>,
) => GroupResult<GenericOutput>;

export function group<
	GenericItem extends unknown,
	GenericOutput extends GroupOutputResult,
>(
	iterator: Iterable<GenericItem>,
	theFunction: (
		item: GenericItem,
		params: GroupTheFunctionParams,
	) => GenericOutput,
): GroupResult<GenericOutput>;

export function group(
	...args:
		| [theFunction: DCommon.AnyFunction<any, GroupOutputResult>]
		| [iterator: Iterable<unknown>, theFunction: DCommon.AnyFunction<any, GroupOutputResult>]
): any {
	if (args.length === 1) {
		const [theFunction] = args;
		return (iterator: Iterable<unknown>) => group(iterator, theFunction);
	}

	const [iterator, theFunction] = args;

	const result: Record<string, unknown[]> = {};

	let index = 0;

	for (const item of iterator) {
		const { group, value } = theFunction(
			item,
			{
				index,
				output: groupOutput,
			},
		);

		if (result[group]) {
			result[group].push(value);
		} else {
			result[group] = [value];
		}

		index++;
	}

	return result;
}
