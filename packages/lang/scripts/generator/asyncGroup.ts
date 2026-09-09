import type * as DCommon from "@scripts/common";
import { groupOutput, type GroupResult, type GroupOutputResult, type GroupTheFunctionParams } from "./group";

type AsyncGroupOutput = DCommon.MaybePromise<GroupOutputResult>;

export function asyncGroup<
	GenericItem extends unknown,
	GenericOutput extends GroupOutputResult,
>(
	theFunction: (
		item: GenericItem,
		params: GroupTheFunctionParams,
	) => DCommon.MaybePromise<GenericOutput>,
): (
	asyncIterator: AsyncIterable<GenericItem>,
) => Promise<GroupResult<GenericOutput>>;

export function asyncGroup<
	GenericItem extends unknown,
	GenericOutput extends GroupOutputResult,
>(
	asyncIterator: AsyncIterable<GenericItem>,
	theFunction: (
		item: GenericItem,
		params: GroupTheFunctionParams,
	) => DCommon.MaybePromise<GenericOutput>,
): Promise<GroupResult<GenericOutput>>;

export function asyncGroup(
	...args:
		| [theFunction: DCommon.AnyFunction<any, AsyncGroupOutput>]
		| [asyncIterator: AsyncIterable<unknown>, theFunction: DCommon.AnyFunction<any, AsyncGroupOutput>]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (asyncIterator: AsyncIterable<unknown>) => asyncGroup(
			asyncIterator,
			theFunction,
		);
	}

	const [asyncIterator, theFunction] = args;

	const result: Record<string, unknown[]> = {};

	let index = 0;

	return (async() => {
		for await (const item of asyncIterator) {
			const { group, value } = await theFunction(
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
	})();
}
