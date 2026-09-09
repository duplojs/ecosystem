import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { informationKind, valueKind } from "./kind";
import { isLeft, left, type Left } from "./left";
import { isRight, right, type Right } from "./right";
import { hasInformation } from "./hasInformation";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

export function keepAsRightByInformation<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericInformation extends (
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	information: GenericInformation | GenericInformation[],
): (
	input: GenericInput,
) => GenericInput extends Either
	? GenericInput extends DKind.Kind<typeof informationKind, GenericInformation>
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

export function keepAsRightByInformation<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericInformation extends (
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	input: GenericInput,
	information: GenericInformation | GenericInformation[],
): GenericInput extends Either
	? GenericInput extends DKind.Kind<typeof informationKind, GenericInformation>
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

export function keepAsRightByInformation(
	...args:
		| [information: DCommon.MaybeArray<string>]
		| [input: unknown, information: DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (input: unknown) => keepAsRightByInformation(
			input as never,
			information as never,
		);
	}

	const [input, information] = args;

	if (hasInformation(input as never, information as never)) {
		if (isLeft(input)) {
			return right(
				informationKind.getValue(input),
				valueKind.getValue(input),
			);
		}

		return input;
	}

	if (isRight(input)) {
		return left(
			informationKind.getValue(input),
			valueKind.getValue(input),
		);
	}

	return input;
}
