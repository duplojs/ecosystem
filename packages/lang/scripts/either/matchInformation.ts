import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import { informationKind, valueKind } from "./kind";
import type { Right } from "./right";
import type { Left } from "./left";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

type ComputeMatcher<
	GenericEither extends Either,
> = Extract<
	{
		[
		Prop in GetInformation<GenericEither>
		]: (
			value: GetValue<
				Extract<
					GenericEither,
					DKind.Kind<
						typeof informationKind,
						Prop
					>
				>
			>,
		) => unknown
	},
	any
>;

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<
		Extract<GenericInput, Either>
	>,
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

export function matchInformation<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<
		Extract<GenericInput, Either>
	>,
	GenericError extends ForbiddenMoreKey<GenericInput, GenericMatcher>,
>(
	matcher: (
		& ComputeMatcher<
			Extract<NoInfer<GenericInput>, Either>
		>
		& GenericMatcher
		& NoInfer<GenericError>
	),
): (input: GenericInput) => (
	| ReturnType<NoInfer<GenericMatcher[keyof GenericMatcher]>>
	| Exclude<NoInfer<GenericInput>, Either>
);

export function matchInformation<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<
		Extract<GenericInput, Either>
	>,
>(
	input: GenericInput,
	matcher: DCommon.FixDeepFunctionInfer<
		ComputeMatcher<
			Extract<GenericInput, Either>
		>,
		GenericMatcher
	>
	& ForbiddenMoreKey<GenericInput, GenericMatcher>,
): (
	| ReturnType<GenericMatcher[keyof GenericMatcher]>
	| Exclude<GenericInput, Either>
);

export function matchInformation(
	...args:
		| [input: unknown, matcher: object]
		| [matcher: object]
): any {
	if (args.length === 1) {
		const [matcher] = args;
		return (input: unknown) => matchInformation(input, matcher);
	}

	const [input, matcher] = args;

	if (
		!informationKind.has(input)
		|| !valueKind.has(input)
	) {
		return input;
	}

	return (matcher[informationKind.getValue(input)] as DCommon.AnyFunction)(valueKind.getValue(input));
}
