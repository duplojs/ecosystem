import type * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericTaggedObject extends DModeling.ObjectTag,
> = {
	[TaggedObject in GenericTaggedObject as DModeling.GetTagValue<TaggedObject>]: (value: TaggedObject) => unknown
};

type ForbiddenMoreKey<
	GenericTaggedObject extends DModeling.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<
		Exclude<
			keyof GenericMatcher,
			DModeling.GetTagValue<GenericTaggedObject>
		>,
		string
	>
>;

type RequireSimpleTag<
	GenericTaggedObject extends DModeling.ObjectTag,
> = DString.RequireSimpleLiteral<
	DModeling.GetTagValue<GenericTaggedObject>
>;

export function matchWithTaggedObject<
	GenericTaggedObject extends DModeling.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericTaggedObject>,
			GenericMatcher
		>
		& ForbiddenMoreKey<NoInfer<GenericTaggedObject>, GenericMatcher>
	),
): (
	input: GenericTaggedObject & RequireSimpleTag<GenericTaggedObject>,
) => ReturnType<
	Extract<
		NoInfer<GenericMatcher>[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithTaggedObject<
	GenericTaggedObject extends DModeling.ObjectTag,
	GenericMatcher extends ComputeMatcher<GenericTaggedObject>,
>(
	input: GenericTaggedObject & RequireSimpleTag<GenericTaggedObject>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericTaggedObject>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericTaggedObject, GenericMatcher>
	),
): ReturnType<
	Extract<
		GenericMatcher[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithTaggedObject(
	...args:
		| [matcher: Record<string, DCommon.AnyFunction>]
		| [input: DModeling.ObjectTag, matcher: Record<string, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: DModeling.ObjectTag) => matcher[DModeling.getTagValue(input)]!(input);
	}

	const [input, matcher] = args;

	return matcher[DModeling.getTagValue(input)]!(input);
}
