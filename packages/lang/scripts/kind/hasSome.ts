import { type Kind, type Handler } from "./base";
import type * as DCommon from "@scripts/common";

export function hasSome<
	GenericInput extends unknown,
	const GenericKindHandlers extends DCommon.AnyTuple<Handler>,
	GenericKindHandler extends GenericKindHandlers[number],
>(
	kinds: GenericKindHandlers,
): (input: GenericInput) => input is Extract<
	GenericInput,
	GenericKindHandler extends any
		? Kind<GenericKindHandler>
		: never
>;

export function hasSome<
	GenericInput extends unknown,
	const GenericKindHandlers extends DCommon.AnyTuple<Handler>,
	GenericKindHandler extends GenericKindHandlers[number],
>(
	input: GenericInput,
	kinds: GenericKindHandlers,
): input is Extract<
	GenericInput,
	GenericKindHandler extends any
		? Kind<GenericKindHandler>
		: never
>;

export function hasSome(
	...args: [DCommon.AnyTuple<Handler>] | [unknown, DCommon.AnyTuple<Handler>]
): any {
	if (args.length === 1) {
		const [kinds] = args;

		return (input: unknown) => hasSome(input, kinds);
	}

	const [input, kinds] = args;

	for (const kind of kinds) {
		if (kind.has(input)) {
			return true;
		}
	}

	return false;
}
