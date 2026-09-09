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
		]?: (
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

export function matchInformationOtherwise<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<
		Extract<GenericInput, Either>
	>,
	GenericOutput extends unknown,
	GenericError extends ForbiddenMoreKey<GenericInput, GenericMatcher>,
>(
	matcher: (
		& ComputeMatcher<
			Extract<NoInfer<GenericInput>, Either>
		>
		& GenericMatcher
		& NoInfer<GenericError>
	),
	otherwise: (
		value: Exclude<
			GenericInput,
			DKind.Kind<
				typeof informationKind,
				Extract<
					DObject.GetPropsWithValueExtends<
						GenericMatcher,
						DCommon.AnyFunction
					>,
					string
				>
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| ReturnType<
		NoInfer<
			Extract<
				GenericMatcher[keyof GenericMatcher],
				DCommon.AnyFunction
			>
		>
	>
	| GenericOutput
);

export function matchInformationOtherwise<
	GenericInput extends unknown,
	GenericMatcher extends ComputeMatcher<
		Extract<GenericInput, Either>
	>,
	GenericOutput extends unknown,
>(
	input: GenericInput,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<
				Extract<GenericInput, Either>
			>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericInput, GenericMatcher>
		& DObject.ForbiddenUndefinedProps<GenericMatcher>
	),
	otherwise: (
		value: Exclude<
			GenericInput,
			DKind.Kind<
				typeof informationKind,
				Extract<
					DObject.GetPropsWithValueExtends<
						GenericMatcher,
						DCommon.AnyFunction
					>,
					string
				>
			>
		>,
	) => GenericOutput,
): (
	| ReturnType<
		NoInfer<
			Extract<
				GenericMatcher[keyof GenericMatcher],
				DCommon.AnyFunction
			>
		>
	>
	| GenericOutput
);

export function matchInformationOtherwise(
	...args:
		| [
			input: unknown,
			matcher: object,
			otherwise: DCommon.AnyFunction,
		]
		| [
			matcher: object,
			otherwise: DCommon.AnyFunction,
		]
): any {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: unknown) => matchInformationOtherwise(input, matcher, otherwise);
	}

	const [input, matcher, otherwise] = args;

	if (
		!informationKind.has(input)
		|| !valueKind.has(input)
	) {
		return otherwise(input);
	}

	const callback = matcher[informationKind.getValue(input)] as DCommon.AnyFunction | undefined;

	if (callback === undefined) {
		return otherwise(input);
	}

	return callback(valueKind.getValue(input));
}
