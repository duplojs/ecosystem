import type * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericFact extends DModeling.Fact,
> = {
	[Fact in GenericFact as DModeling.GetFactName<Fact>]: (value: Fact) => unknown
};

type ForbiddenMoreKey<
	GenericFact extends DModeling.Fact,
	GenericMatcher extends ComputeMatcher<GenericFact>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<
		Exclude<
			keyof GenericMatcher,
			DModeling.GetFactName<GenericFact>
		>,
		string
	>
>;

type RequireSimpleName<
	GenericFact extends DModeling.Fact,
> = DString.RequireSimpleLiteral<
	DModeling.GetFactName<GenericFact>
>;

export function matchWithFact<
	GenericFact extends DModeling.Fact,
	GenericMatcher extends ComputeMatcher<GenericFact>,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericFact>,
			GenericMatcher
		>
		& ForbiddenMoreKey<NoInfer<GenericFact>, GenericMatcher>
	),
): (
	input: GenericFact & RequireSimpleName<GenericFact>,
) => ReturnType<
	Extract<
		NoInfer<GenericMatcher>[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithFact<
	GenericFact extends DModeling.Fact,
	GenericMatcher extends ComputeMatcher<GenericFact>,
>(
	input: GenericFact & RequireSimpleName<GenericFact>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericFact>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericFact, GenericMatcher>
	),
): ReturnType<
	Extract<
		GenericMatcher[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithFact(
	...args:
		| [matcher: Record<string, DCommon.AnyFunction>]
		| [input: DModeling.Fact, matcher: Record<string, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: DModeling.Fact) => matcher[DModeling.factKind.getValue(input).name]!(input);
	}

	const [input, matcher] = args;

	return matcher[DModeling.factKind.getValue(input).name]!(input);
}
