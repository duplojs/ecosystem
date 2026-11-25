import { ExtractByTagValue, GetTagValue, ShapeTaggedObjectStructure, TaggedObjectStructure, ObjectTag } from './base';
import { createKind } from '../kind';
import type * as DKind from '../../kind';
import type * as DCommon from '../../common';
import type * as DDataStructure from '../../dataStructure';
import type * as DObject from '../../object';
import * as DArray from '../../array';
export declare function getTagValue<GenericObjectTag extends ObjectTag>(objectTag: GenericObjectTag): GetTagValue<GenericObjectTag>;
export declare function hasTagValue<GenericInput extends unknown, GenericTagValue extends (GenericInput extends ObjectTag ? GetTagValue<GenericInput> : never)>(value: DCommon.MaybeArray<GenericTagValue>): (input: GenericInput) => input is ExtractByTagValue<GenericInput, GenericTagValue>;
export declare function hasTagValue<GenericInput extends unknown, GenericTagValue extends (GenericInput extends ObjectTag ? GetTagValue<GenericInput> : never)>(input: GenericInput, value: DCommon.MaybeArray<GenericTagValue>): input is ExtractByTagValue<GenericInput, GenericTagValue>;
type ObjectTagGroupKindHandler = ReturnType<typeof createKind<"object-tag-group", {
    name: string;
    properties: object;
}>>;
export interface ObjectTagGroup<GenericName extends string = string, GenericProperties extends object = {}> extends DKind.Kind<ObjectTagGroupKindHandler, {
    name: GenericName;
    properties: GenericProperties;
}> {
}
type ObjectTagGroupInput = ObjectTagGroup | readonly ObjectTagGroupInput[];
type ComputeGroupTag<GenericGroups extends readonly ObjectTagGroupInput[], GenericSeenNames extends string = never> = GenericGroups extends readonly [] ? "" : GenericGroups extends readonly [
    infer InferredFirst extends ObjectTagGroupInput,
    ...infer InferredRest extends readonly ObjectTagGroupInput[]
] ? InferredFirst extends readonly ObjectTagGroupInput[] ? ComputeGroupTag<readonly [...InferredFirst, ...InferredRest], GenericSeenNames> : InferredFirst extends ObjectTagGroup ? DKind.GetValue<ObjectTagGroupKindHandler, InferredFirst>["name"] extends GenericSeenNames ? ComputeGroupTag<InferredRest, GenericSeenNames> : `[${DKind.GetValue<ObjectTagGroupKindHandler, InferredFirst>["name"]}]${ComputeGroupTag<InferredRest, GenericSeenNames | DKind.GetValue<ObjectTagGroupKindHandler, InferredFirst>["name"]>}` : never : never;
type ComputeGroupShape<GenericGroup extends ObjectTagGroupInput> = GenericGroup extends ObjectTagGroup ? DKind.GetValue<ObjectTagGroupKindHandler, GenericGroup>["properties"] : GenericGroup extends readonly [] ? unknown : GenericGroup extends readonly [
    infer InferredFirst extends ObjectTagGroupInput,
    ...infer InferredRest extends readonly ObjectTagGroupInput[]
] ? ComputeGroupShape<InferredFirst> & ComputeGroupShape<InferredRest> : never;
export type ObjectTagWithGroup<GenericValue extends string = string, GenericGroup extends ObjectTagGroupInput = ObjectTagGroup> = (ObjectTag<`${ComputeGroupTag<DArray.Coalescing<GenericGroup>>}${GenericValue}`> & DCommon.UnionToIntersection<ComputeGroupShape<GenericGroup>>);
type ExtractTagGroups<GenericTagValue extends string> = string extends GenericTagValue ? never : GenericTagValue extends `${string}[${infer InferredGroup}]${infer InferredRest}` ? InferredGroup | ExtractTagGroups<InferredRest> : never;
export declare function hasTagGroup<GenericInput extends ObjectTag, GenericGroup extends ExtractTagGroups<GetTagValue<GenericInput>>>(group: DCommon.MaybeArray<GenericGroup>): (input: GenericInput) => input is Extract<GenericInput, ObjectTag<`${string}[${GenericGroup}]${string}`>>;
export declare function hasTagGroup<GenericInput extends ObjectTag, GenericGroup extends ExtractTagGroups<GetTagValue<GenericInput>>>(input: GenericInput, group: DCommon.MaybeArray<GenericGroup>): input is Extract<GenericInput, ObjectTag<`${string}[${GenericGroup}]${string}`>>;
export declare function taggedObject<GenericTaggedObject extends ObjectTag>(...args: GenericTaggedObject extends unknown ? [
    tag: NoInfer<GetTagValue<GenericTaggedObject>>,
    props: NoInfer<DCommon.SimplifyTopLevel<DKind.Remove<ExtractByTagValue<GenericTaggedObject, GetTagValue<GenericTaggedObject>>>>>
] : never): GenericTaggedObject;
export declare function createTaggedObjectFactory<GenericTaggedObject extends ObjectTag = never>(tag: (GetTagValue<GenericTaggedObject> & DCommon.ForbiddenUnion<GenericTaggedObject>)): (properties: DCommon.SimplifyTopLevel<DKind.Remove<GenericTaggedObject>>) => GenericTaggedObject;
export type RequireTaggedObjectSameShape<GenericTaggedObject extends ObjectTag, GenericTaggedObjectShape extends ShapeTaggedObjectStructure> = DCommon.IsEqual<DCommon.SimplifyTopLevel<DObject.DeepReadonly<DKind.Remove<GenericTaggedObject>>>, DCommon.SimplifyTopLevel<DObject.DeepReadonly<DDataStructure.ShapeObjectStructureValue<GenericTaggedObjectShape>>>> extends true ? unknown : DCommon.ComputedTypeError<"Shape do not match.">;
export declare function createTaggedObject<GenericTaggedObject extends ObjectTag>(name: GetTagValue<GenericTaggedObject>): <GenericShape extends ShapeTaggedObjectStructure<GenericTaggedObject>>(shape: (GenericShape & RequireTaggedObjectSameShape<GenericTaggedObject, GenericShape>)) => TaggedObjectStructure<GenericTaggedObject>;
export declare function createTaggedObject<GenericTaggedObject extends ObjectTag, GenericName extends string = never, GenericShape extends DDataStructure.ShapeObjectStructure = never>(name: GetTagValue<GenericTaggedObject> | GenericName, shape: ShapeTaggedObjectStructure<GenericTaggedObject> | GenericShape): TaggedObjectStructure<ObjectTag extends GenericTaggedObject ? (ObjectTag<GenericName> & DDataStructure.ShapeObjectStructureValue<GenericShape>) : GenericTaggedObject>;
export {};
