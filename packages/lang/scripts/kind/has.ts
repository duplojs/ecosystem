import { type Kind, type Handler } from "./base";
import type * as DCommon from "@scripts/common";

export function has<
	GenericInput extends unknown,
	const GenericKindHandlers extends DCommon.AnyTuple<Handler>,
	GenericKindHandler extends GenericKindHandlers[number],
>(
	kinds: GenericKindHandlers,
): (input: GenericInput) => input is Extract<
	GenericInput,
	DCommon.UnionToIntersection<
		GenericKindHandler extends any
			? Kind<GenericKindHandler>
			: never
	>
>;

export function has<
	GenericInput extends unknown,
	const GenericKindHandlers extends DCommon.AnyTuple<Handler>,
	GenericKindHandler extends GenericKindHandlers[number],
>(
	input: GenericInput,
	kinds: GenericKindHandlers,
): input is Extract<
	GenericInput,
	DCommon.UnionToIntersection<
		GenericKindHandler extends any
			? Kind<GenericKindHandler>
			: never
	>
>;

export function has(
	...args: [DCommon.AnyTuple<Handler>] | [unknown, DCommon.AnyTuple<Handler>]
): any {
	if (args.length === 1) {
		const [kinds] = args;

		return (input: unknown) => has(input, kinds);
	}

	const [input, kinds] = args;

	for (const kind of kinds) {
		if (!kind.has(input)) {
			return false;
		}
	}

	return true;
}
