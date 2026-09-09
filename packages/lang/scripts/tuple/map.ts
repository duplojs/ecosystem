import type * as DCommon from "@scripts/common";
import type { Map } from "./types";

export interface MapTheFunctionParams<
	GenericTuple extends DCommon.AnyTuple,
> {
	index: number;
	self: GenericTuple;
}

export function map<
	const GenericTuple extends DCommon.AnyTuple,
	GenericOutput extends unknown,
>(
	theFunction: (
		element: GenericTuple[number],
		params: MapTheFunctionParams<GenericTuple>,
	) => GenericOutput,
): (
	tuple: GenericTuple,
) => Map<
	GenericTuple,
	GenericOutput
>;

export function map<
	const GenericTuple extends DCommon.AnyTuple,
	GenericOutput extends unknown,
>(
	tuple: GenericTuple,
	theFunction: (
		element: GenericTuple[number],
		params: MapTheFunctionParams<GenericTuple>,
	) => GenericOutput,
): Map<
	GenericTuple,
	GenericOutput
>;

export function map(
	...args:
		| [theFunction: DCommon.AnyFunction]
		| [tuple: DCommon.AnyTuple, theFunction: DCommon.AnyFunction]
): any {
	if (args.length === 1) {
		const [theFunction] = args;

		return (tuple: DCommon.AnyTuple) => map(tuple, theFunction);
	}
	const [tuple, theFunction] = args;

	return tuple.map((element, index) => theFunction(
		element,
		{
			index,
			self: tuple,
		},
	));
}
