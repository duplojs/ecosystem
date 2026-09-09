import type * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericEntity extends DModeling.Entity,
> = {
	[Entity in GenericEntity as DModeling.GetEntityName<Entity>]: (value: Entity) => unknown
};

type ForbiddenMoreKey<
	GenericEntity extends DModeling.Entity,
	GenericMatcher extends ComputeMatcher<GenericEntity>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<
		Exclude<
			keyof GenericMatcher,
			DModeling.GetEntityName<GenericEntity>
		>,
		string
	>
>;

type RequireSimpleName<
	GenericEntity extends DModeling.Entity,
> = DString.RequireSimpleLiteral<
	DModeling.GetEntityName<GenericEntity>
>;

export function matchWithEntity<
	GenericEntity extends DModeling.Entity,
	GenericMatcher extends ComputeMatcher<GenericEntity>,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericEntity>,
			GenericMatcher
		>
		& ForbiddenMoreKey<NoInfer<GenericEntity>, GenericMatcher>
	),
): (
	input: GenericEntity & RequireSimpleName<GenericEntity>,
) => ReturnType<
	Extract<
		NoInfer<GenericMatcher>[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithEntity<
	GenericEntity extends DModeling.Entity,
	GenericMatcher extends ComputeMatcher<GenericEntity>,
>(
	input: GenericEntity & RequireSimpleName<GenericEntity>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericEntity>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericEntity, GenericMatcher>
	),
): ReturnType<
	Extract<
		GenericMatcher[keyof GenericMatcher],
		DCommon.AnyFunction
	>
>;

export function matchWithEntity(
	...args:
		| [matcher: Record<string, DCommon.AnyFunction>]
		| [input: DModeling.Entity, matcher: Record<string, DCommon.AnyFunction>]
): unknown {
	if (args.length === 1) {
		const [matcher] = args;

		return (input: DModeling.Entity) => matcher[DModeling.entityKind.getValue(input)]!(input);
	}

	const [input, matcher] = args;

	return matcher[DModeling.entityKind.getValue(input)]!(input);
}
