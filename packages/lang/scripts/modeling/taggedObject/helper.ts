import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import type * as DDataStructure from "@scripts/dataStructure";
import type * as DObject from "@scripts/object";
import { type ExtractByTagValue, type GetTagValue, objectTagKind, type ShapeTaggedObjectStructure, TaggedObjectStructure, type ObjectTag } from "./base";

export function getTagValue<
	GenericObjectTag extends ObjectTag,
>(objectTag: GenericObjectTag): GetTagValue<GenericObjectTag> {
	return objectTagKind.getValue(objectTag);
}

export function hasTagValue<
	GenericInput extends unknown,
	GenericTagValue extends (
		GenericInput extends ObjectTag
			? GetTagValue<GenericInput>
			: never
	),
>(
	value: DCommon.MaybeArray<GenericTagValue>,
): (input: GenericInput) => input is ExtractByTagValue<
	GenericInput,
	GenericTagValue
>;
export function hasTagValue<
	GenericInput extends unknown,
	GenericTagValue extends (
		GenericInput extends ObjectTag
			? GetTagValue<GenericInput>
			: never
	),
>(
	input: GenericInput,
	value: DCommon.MaybeArray<GenericTagValue>,
): input is ExtractByTagValue<
	GenericInput,
	GenericTagValue
>;
export function hasTagValue(
	...args:
		| [value: DCommon.MaybeArray<string>]
		| [input: unknown, value: DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [value] = args;

		return (input: unknown) => hasTagValue(input as never, value as never);
	}

	const [input, value] = args;

	if (!objectTagKind.has(input)) {
		return false;
	}

	const tagValue = objectTagKind.getValue(input);

	return Array.isArray(value)
		? value.includes(tagValue)
		: tagValue === value;
}

export function taggedObject<
	GenericTaggedObject extends ObjectTag,
>(
	...args: GenericTaggedObject extends unknown
		? [
			tag: NoInfer<GetTagValue<GenericTaggedObject>>,
			props: NoInfer<
				DCommon.SimplifyTopLevel<
					DKind.Remove<
						ExtractByTagValue<
							GenericTaggedObject,
							GetTagValue<GenericTaggedObject>
						>
					>
				>
			>,
		]
		: never
): GenericTaggedObject;

export function taggedObject(
	tag: string,
	props: object,
) {
	return {
		...props,
		[objectTagKind.runTimeKey]: tag,
	};
}

export type RequireTaggedObjectSameShape<
	GenericTaggedObject extends ObjectTag,
	GenericTaggedObjectShape extends ShapeTaggedObjectStructure,
> = DCommon.IsEqual<
	DCommon.SimplifyTopLevel<
		DObject.DeepReadonly<
			DKind.Remove<GenericTaggedObject>
		>
	>,
	DCommon.SimplifyTopLevel<
		DObject.DeepReadonly<
			DDataStructure.ShapeObjectStructureValue<
				GenericTaggedObjectShape
			>
		>
	>
> extends true
	? unknown
	: DCommon.ComputedTypeError<"Shape do not match.">;

export function createTaggedObject<
	GenericTaggedObject extends ObjectTag,
>(
	name: GetTagValue<GenericTaggedObject>,
): <
	GenericShape extends ShapeTaggedObjectStructure<GenericTaggedObject>,
>(
	shape: (
		& GenericShape
		& RequireTaggedObjectSameShape<
			GenericTaggedObject,
			GenericShape
		>
	),
) => TaggedObjectStructure<GenericTaggedObject>;

export function createTaggedObject<
	GenericTaggedObject extends ObjectTag,
	GenericName extends string = never,
	GenericShape extends DDataStructure.ShapeObjectStructure = never,
>(
	name: GetTagValue<GenericTaggedObject> | GenericName,
	shape: ShapeTaggedObjectStructure<GenericTaggedObject> | GenericShape,
): TaggedObjectStructure<
	ObjectTag extends GenericTaggedObject
		? (
			& ObjectTag<GenericName>
			& DDataStructure.ShapeObjectStructureValue<GenericShape>
		)
		: GenericTaggedObject
>;

export function createTaggedObject(
	...args: [string]
		| [string, object]
): any {
	if (args.length === 1) {
		const [name] = args;
		return (shape: object) => createTaggedObject(
			name,
			shape,
		) as never;
	}

	const [name, shape] = args;

	return TaggedObjectStructure(name, shape);
}
