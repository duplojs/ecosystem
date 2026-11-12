import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import type * as DDataStructure from "@scripts/dataStructure";
import type * as DObject from "@scripts/object";
import { type ExtractByTagValue, type GetTagValue, objectTagKind, type ShapeTaggedObjectStructure, TaggedObjectStructure, type ObjectTag } from "./base";
import * as DString from "@scripts/string";
import * as DArray from "@scripts/array";
import { type createKind } from "../kind";
import * as DEither from "@scripts/either";

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

type ObjectTagGroupKindHandler = ReturnType<
	typeof createKind<
		"object-tag-group",
		{
			name: string;
			properties: object;
		}
	>
>;

export interface ObjectTagGroup<
	GenericName extends string = string,
	GenericProperties extends object = {},
> extends DKind.Kind<
		ObjectTagGroupKindHandler,
		{
			name: GenericName;
			properties: GenericProperties;
		}
	> {

}

type ComputeGroupTag<
	GenericGroups extends readonly ObjectTagGroup[],
> = GenericGroups extends readonly []
	? ""
	: GenericGroups extends readonly [
		infer InferredFirst extends ObjectTagGroup,
		...infer InferredRest extends readonly ObjectTagGroup[],
	]
		? `[${DKind.GetValue<ObjectTagGroupKindHandler, InferredFirst>["name"]}]${ComputeGroupTag<InferredRest>}`
		: never;

type ComputeGroupShape<
	GenericGroups extends readonly ObjectTagGroup[],
> = DCommon.UnionToIntersection<
	DArray.Unwrap<GenericGroups> extends infer InferredElement
		? InferredElement extends ObjectTagGroup
			? DKind.GetValue<ObjectTagGroupKindHandler, InferredElement>["properties"]
			: never
		: never
>;

export type ObjectTagWithGroup<
	GenericValue extends string = string,
	GenericGroup extends ObjectTagGroup | readonly ObjectTagGroup[] = ObjectTagGroup,
> = (
	& ObjectTag<`${ComputeGroupTag<DArray.Coalescing<GenericGroup>>}${GenericValue}`>
	& ComputeGroupShape<DArray.Coalescing<GenericGroup>>
);

type ExtractTagGroups<
	GenericTagValue extends string,
> = string extends GenericTagValue
	? never
	: GenericTagValue extends `${string}[${infer InferredGroup}]${infer InferredRest}`
		? InferredGroup | ExtractTagGroups<InferredRest>
		: never;

export function hasTagGroup<
	GenericInput extends ObjectTag,
	GenericGroup extends ExtractTagGroups<GetTagValue<GenericInput>>,
>(
	group: DCommon.MaybeArray<GenericGroup>,
): (input: GenericInput) => input is Extract<
	GenericInput,
	ObjectTag<`${string}[${GenericGroup}]${string}`>
>;

export function hasTagGroup<
	GenericInput extends ObjectTag,
	GenericGroup extends ExtractTagGroups<GetTagValue<GenericInput>>,
>(
	input: GenericInput,
	group: DCommon.MaybeArray<GenericGroup>,
): input is Extract<
	GenericInput,
	ObjectTag<`${string}[${GenericGroup}]${string}`>
>;

export function hasTagGroup(
	...args:
		| [group: DCommon.MaybeArray<string>]
		| [input: ObjectTag, group: DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [group] = args;

		return (input: ObjectTag) => hasTagGroup(input, group as never);
	}

	const [input, group] = args;
	const tagValue = getTagValue(input);

	return DArray.is(group)
		? DArray.some(group, (value) => DString.includes(tagValue, `[${value}]`))
		: DString.includes(tagValue, `[${group}]`);
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

export function createTaggedObjectFactory<
	GenericTaggedObject extends ObjectTag = never,
>(
	tag: (
		& GetTagValue<GenericTaggedObject>
		& DCommon.ForbiddenUnion<GenericTaggedObject>
	),
) {
	return (
		properties: DCommon.SimplifyTopLevel<
			DKind.Remove<
				GenericTaggedObject
			>
		>,
	): GenericTaggedObject => ({
		...properties,
		[objectTagKind.runTimeKey]: tag,
	}) as never;
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
