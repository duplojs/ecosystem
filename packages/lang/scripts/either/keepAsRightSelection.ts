import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import { informationKind, valueKind } from "./kind";
import { isLeft, left, type Left } from "./left";
import { isRight, right, type Right } from "./right";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = DObject.ForbiddenKey<
	GenericSelector,
	Extract<
		Exclude<
			keyof GenericSelector,
			GetInformation<Extract<GenericInput, Either>>
		>,
		string
	>
>;

export function keepAsRightSelection<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (
	input: GenericInput,
) => GenericInput extends Either
	? GenericInput extends DKind.Kind<
		typeof informationKind,
		Extract<
			| DObject.GetPropsWithValue<GenericSelector, true>
			| DObject.GetPropsWithValue<GenericSelector, boolean>,
			string
		>
	>
		? GenericInput extends Right
			? GenericInput
			: Right<
				GetInformation<GenericInput>,
				GetValue<GenericInput>
			>
		: Left<
			GetInformation<GenericInput>,
			GetValue<GenericInput>
		>
	: GenericInput;

export function keepAsRightSelection<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): GenericInput extends Either
	? GenericInput extends DKind.Kind<
		typeof informationKind,
		Extract<
			| DObject.GetPropsWithValue<GenericSelector, true>
			| DObject.GetPropsWithValue<GenericSelector, boolean>,
			string
		>
	>
		? GenericInput extends Right
			? GenericInput
			: Right<
				GetInformation<GenericInput>,
				GetValue<GenericInput>
			>
		: Left<
			GetInformation<GenericInput>,
			GetValue<GenericInput>
		>
	: GenericInput;

export function keepAsRightSelection(
	...args:
		| [selector: Record<string, boolean>]
		| [input: unknown, selector: Record<string, boolean>]
): any {
	if (args.length === 1) {
		const [selector] = args;

		return (input: unknown) => keepAsRightSelection(input as never, selector as never);
	}

	const [input, selector] = args;

	if (
		!informationKind.has(input)
		|| !valueKind.has(input)
	) {
		return input;
	}

	const information = informationKind.getValue(input);

	if (selector[information] === true) {
		if (isLeft(input)) {
			return right(information, valueKind.getValue(input));
		}

		return input;
	}

	if (isRight(input)) {
		return left(information, valueKind.getValue(input));
	}

	return input;
}
