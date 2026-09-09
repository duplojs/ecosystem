import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import { informationKind, valueKind } from "./kind";
import { isLeft, left, type Left } from "./left";
import { isRight, right, type Right } from "./right";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

type ComputeMatcher<
	GenericInput extends unknown,
> = {
	[
	Prop in GetInformation<Extract<GenericInput, Either>>
	]?: string
};

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<
		Exclude<
			keyof GenericMatcher,
			GetInformation<Extract<GenericInput, Either>>
		>,
		string
	>
>;

type ComputeResult<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = GenericInput extends Right
	? GetInformation<GenericInput> extends keyof GenericMatcher
		? Right<
			Extract<
				GenericMatcher[GetInformation<GenericInput>],
				string
			>,
			GetValue<GenericInput>
		>
		: GenericInput
	: GenericInput extends Left
		? GetInformation<GenericInput> extends keyof GenericMatcher
			? Left<
				Extract<
					GenericMatcher[GetInformation<GenericInput>],
					string
				>,
				GetValue<GenericInput>
			>
			: GenericInput
		: GenericInput;

export function rewriteInformation<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericMatcher extends ComputeMatcher<GenericInput>,
>(
	matcher: (
		& GenericMatcher
		& ForbiddenMoreKey<GenericInput, GenericMatcher>
		& DObject.ForbiddenUndefinedProps<GenericMatcher>
	),
): (input: GenericInput) => ComputeResult<GenericInput, GenericMatcher>;

export function rewriteInformation<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericMatcher extends ComputeMatcher<GenericInput>,
>(
	input: GenericInput,
	matcher: (
		& GenericMatcher
		& ForbiddenMoreKey<GenericInput, GenericMatcher>
		& DObject.ForbiddenUndefinedProps<GenericMatcher>
	),
): ComputeResult<GenericInput, GenericMatcher>;

export function rewriteInformation(
	...args:
		| [matcher: Record<string, string>]
		| [input: unknown, matcher: Record<string, string>]
): any {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: unknown) => rewriteInformation(
			input as never,
			matcher as never,
		);
	}

	const [input, matcher] = args;
	const inputIsRight = isRight(input);

	if (!inputIsRight && !isLeft(input)) {
		return input;
	}

	const information = matcher[informationKind.getValue(input)];

	if (information === undefined) {
		return input;
	}

	const value = valueKind.getValue(input);

	if (inputIsRight) {
		return right(information, value);
	}

	return left(information, value);
}
