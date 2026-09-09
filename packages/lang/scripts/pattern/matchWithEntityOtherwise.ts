import type * as DCommon from "@scripts/common";
import * as DModeling from "@scripts/modeling";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";

type ComputeMatcher<
	GenericEntity extends DModeling.Entity,
> = {
	[Entity in GenericEntity as DModeling.GetEntityName<Entity>]?: (value: Entity) => unknown
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

type HandledKeys<
	GenericMatcher extends object,
> = Extract<
	DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>,
	string
>;

type UnhandledEntity<
	GenericEntity extends DModeling.Entity,
	GenericMatcher extends object,
> = Exclude<
	GenericEntity,
	DModeling.ExtractByEntityName<
		GenericEntity,
		HandledKeys<GenericMatcher>
	>
>;

type RequireSimpleName<
	GenericEntity extends DModeling.Entity,
> = DString.RequireSimpleLiteral<
	DModeling.GetEntityName<GenericEntity>
>;

export function matchWithEntityOtherwise<
	GenericEntity extends DModeling.Entity,
	GenericMatcher extends ComputeMatcher<GenericEntity>,
	GenericOutput,
>(
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericEntity>,
			GenericMatcher
		>
		& ForbiddenMoreKey<NoInfer<GenericEntity>, GenericMatcher>
	),
	otherwise: (value: UnhandledEntity<GenericEntity, GenericMatcher>) => GenericOutput,
): (
	input: GenericEntity & RequireSimpleName<GenericEntity>,
) => (
	| ReturnType<
		Extract<
			NoInfer<GenericMatcher>[keyof GenericMatcher],
			DCommon.AnyFunction
		>
	>
	| GenericOutput
);

export function matchWithEntityOtherwise<
	GenericEntity extends DModeling.Entity,
	GenericMatcher extends ComputeMatcher<GenericEntity>,
	GenericOutput,
>(
	input: GenericEntity & RequireSimpleName<GenericEntity>,
	matcher: (
		& DCommon.FixDeepFunctionInfer<
			ComputeMatcher<GenericEntity>,
			GenericMatcher
		>
		& ForbiddenMoreKey<GenericEntity, GenericMatcher>
	),
	otherwise: (value: UnhandledEntity<GenericEntity, GenericMatcher>) => GenericOutput,
): (
	| ReturnType<
		Extract<
			GenericMatcher[keyof GenericMatcher],
			DCommon.AnyFunction
		>
	>
	| GenericOutput
);

export function matchWithEntityOtherwise(
	...args:
		| [
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
		| [
			input: DModeling.Entity,
			matcher: Record<string, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
): unknown {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: DModeling.Entity) => matchWithEntityOtherwise(
			input as never,
			matcher as never,
			otherwise,
		);
	}

	const [input, matcher, otherwise] = args;
	const entityName = DModeling.entityKind.getValue(input);

	return matcher[entityName] === undefined
		? otherwise(input)
		: matcher[entityName](input);
}
