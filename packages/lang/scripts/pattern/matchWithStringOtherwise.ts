import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericInput extends string,
> = DCommon.SimplifyType<{
	[Prop in GenericInput]?: (value: Prop) => unknown
}>;

type ForbiddenMoreKey<
	GenericInput extends string,
	GenericMatcher extends ComputeMatcher<GenericInput>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<Exclude<keyof GenericMatcher, GenericInput>, string>
>;

type HandledKeys<GenericMatcher extends object> = Extract<
	DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>,
	string
>;

export function matchWithStringOtherwise<
	GenericInput extends string,
	GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>,
	GenericMatcher extends ComputeMatcher<GenericClearInput>,
	GenericOutput extends unknown,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericClearInput>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericClearInput, GenericMatcher>
	),
	otherwise: (value: Exclude<GenericInput, HandledKeys<GenericMatcher>>) => GenericOutput,
): (
	input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>,
) => (
	| ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithStringOtherwise<
	GenericInput extends string,
	GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, string>,
	GenericMatcher extends ComputeMatcher<GenericClearInput>,
	GenericOutput extends unknown,
>(
	input: GenericInput & DString.RequireSimpleLiteral<GenericClearInput>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericClearInput>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericClearInput, GenericMatcher>
	),
	otherwise: (value: Exclude<GenericInput, HandledKeys<GenericMatcher>>) => GenericOutput,
): (
	| ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithStringOtherwise(
	...args:
		| [
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
		| [
			input: string,
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
): unknown {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: string) => matchWithStringOtherwise(
			input as never,
			matcher as never,
			otherwise,
		);
	}

	const [input, matcher, otherwise] = args;
	return matcher[input] === undefined
		? otherwise(input)
		: matcher[input](input);
}
