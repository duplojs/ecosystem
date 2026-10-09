import { ExtractByTagValue, GetTagValue, ShapeTaggedObjectStructure, TaggedObjectStructure, ObjectTag } from './base';
import type * as DKind from '../../kind';
import type * as DCommon from '../../common';
import type * as DDataStructure from '../../dataStructure';
import type * as DObject from '../../object';
export declare function getTagValue<GenericObjectTag extends ObjectTag>(objectTag: GenericObjectTag): GetTagValue<GenericObjectTag>;
export declare function hasTagValue<GenericInput extends unknown, GenericTagValue extends (GenericInput extends ObjectTag ? GetTagValue<GenericInput> : never)>(value: DCommon.MaybeArray<GenericTagValue>): (input: GenericInput) => input is ExtractByTagValue<GenericInput, GenericTagValue>;
export declare function hasTagValue<GenericInput extends unknown, GenericTagValue extends (GenericInput extends ObjectTag ? GetTagValue<GenericInput> : never)>(input: GenericInput, value: DCommon.MaybeArray<GenericTagValue>): input is ExtractByTagValue<GenericInput, GenericTagValue>;
export declare function taggedObject<GenericTaggedObject extends ObjectTag>(...args: GenericTaggedObject extends unknown ? [
    tag: NoInfer<GetTagValue<GenericTaggedObject>>,
    props: NoInfer<DCommon.SimplifyTopLevel<DKind.Remove<ExtractByTagValue<GenericTaggedObject, GetTagValue<GenericTaggedObject>>>>>
] : never): GenericTaggedObject;
export type RequireTaggedObjectSameShape<GenericTaggedObject extends ObjectTag, GenericTaggedObjectShape extends ShapeTaggedObjectStructure> = DCommon.IsEqual<DCommon.SimplifyTopLevel<DObject.DeepReadonly<DKind.Remove<GenericTaggedObject>>>, DCommon.SimplifyTopLevel<DObject.DeepReadonly<DDataStructure.ShapeObjectStructureValue<GenericTaggedObjectShape>>>> extends true ? unknown : DCommon.ComputedTypeError<"Shape do not match.">;
export declare function createTaggedObject<GenericTaggedObject extends ObjectTag>(name: GetTagValue<GenericTaggedObject>): <GenericShape extends ShapeTaggedObjectStructure<GenericTaggedObject>>(shape: (GenericShape & RequireTaggedObjectSameShape<GenericTaggedObject, GenericShape>)) => TaggedObjectStructure<GenericTaggedObject>;
export declare function createTaggedObject<GenericTaggedObject extends ObjectTag, GenericName extends string = never, GenericShape extends DDataStructure.ShapeObjectStructure = never>(name: GetTagValue<GenericTaggedObject> | GenericName, shape: ShapeTaggedObjectStructure<GenericTaggedObject> | GenericShape): TaggedObjectStructure<ObjectTag extends GenericTaggedObject ? (ObjectTag<GenericName> & DDataStructure.ShapeObjectStructureValue<GenericShape>) : GenericTaggedObject>;
