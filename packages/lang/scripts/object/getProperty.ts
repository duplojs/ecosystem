import type * as DCommon from "@scripts/common";
import type { PartialKeys, UnionObjectToIntersection } from "./types";

type MergeTopLevelUnionObject<
	GenericObject extends object,
	GenericFullObjectKeys extends keyof UnionObjectToIntersection<GenericObject> =
		keyof UnionObjectToIntersection<GenericObject>,
> = PartialKeys<
	{
		[Prop in GenericFullObjectKeys]: (
			GenericObject extends object
				? Prop extends keyof GenericObject
					? GenericObject[Prop]
					: never
				: never
		)
	},
	Exclude<
		GenericFullObjectKeys,
		keyof GenericObject
	>
>;

export function getProperty<
	GenericObject extends object,
	GenericFullObject extends MergeTopLevelUnionObject<GenericObject>,
	GenericKey extends keyof GenericFullObject,
>(
	key: GenericKey,
): (
	object: GenericObject,
) => GenericFullObject[GenericKey];

export function getProperty<
	GenericObject extends object,
	GenericFullObject extends MergeTopLevelUnionObject<GenericObject>,
	GenericKey extends keyof GenericFullObject,
>(
	obj: GenericObject,
	key: GenericKey,
): GenericFullObject[GenericKey];

export function getProperty(
	...args:
		| [key: DCommon.ObjectKey]
		| [object: object, key: DCommon.ObjectKey]
): any {
	if (args.length === 1) {
		const [key] = args;

		return (object: object) => getProperty(object, key as never);
	}
	const [object, key] = args;

	return (object as Record<DCommon.ObjectKey, unknown>)[key];
}
