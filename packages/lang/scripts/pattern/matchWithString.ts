import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string/types";

type ComputeMatcher<
	GenericInput extends string,
> = DCommon.SimplifyType<{
	[Prop in GenericInput]: (value: Prop) => unknown
}>;

type ForbiddenMoreKey<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<Exclude<keyof GenericMatcher, GenericInput>, string>
>;

export function matchWithString<
	GenericInput extends string,
	GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>,
	GenericMatcher extends ComputeMatcher<GenericClearInput>,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericClearInput>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericClearInput, GenericMatcher>
	),
): (
	input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>,
) => ReturnType<
	GenericMatcher[keyof GenericMatcher]
>;

export function matchWithString<
	GenericInput extends string,
	GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>,
	GenericMatcher extends ComputeMatcher<GenericClearInput>,
>(
	input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericClearInput>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericClearInput, GenericMatcher>
	),
): ReturnType<
	GenericMatcher[keyof GenericMatcher]
>;

export function matchWithString(
	...args:
		| [matcher: Record<string, DCommon.AnyFunction>]
		| [input: string, matcher: Record<string, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: string) => matcher[input]!(input);
	}

	const [input, matcher] = args;

	return matcher[input]!(input);
}
