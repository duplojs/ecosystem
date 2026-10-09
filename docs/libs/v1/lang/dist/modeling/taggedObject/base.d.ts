import { NewType, NewTypeMap } from '../newType';
import type * as DKind from '../../kind';
import * as DCommon from '../../common';
import * as DEither from '../../either';
import * as DDataStructure from '../../dataStructure';
declare module '../../dataStructure' {
    interface StructuresStore {
        taggedObject: TaggedObjectStructure;
    }
}
declare module '../../dataStructure/common' {
    interface EncodeStructure<GenericValue extends unknown, GenericCodecs extends DDataStructure.Codecs> {
        taggedObject: GenericValue extends ObjectTag<infer InferredName> ? (ObjectTag<InferredName> & {
            [Prop in Exclude<keyof GenericValue, DKind.KeySymbol>]: DDataStructure.EncodedValue<GenericValue[Prop], GenericCodecs>;
        }) : never;
    }
}
export declare const objectTagKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/object-tag", string>>;
export interface ObjectTag<GenericValue extends string = string> extends DKind.Kind<typeof objectTagKind, GenericValue> {
}
export type GetTagValue<GenericTaggedObject extends ObjectTag> = DKind.GetValue<typeof objectTagKind, GenericTaggedObject>;
export type ExtractByTagValue<GenericValue extends unknown, GenericTagValue extends string> = GenericValue extends ObjectTag<GenericTagValue> ? GenericValue : never;
export type ShapeTaggedObjectStructure<GenericTaggedObject extends ObjectTag = ObjectTag> = {
    [Prop in Extract<keyof GenericTaggedObject, string>]: DDataStructure.Structure<GenericTaggedObject[Prop]>;
};
export declare const taggedObjectStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/tagged-object-structure", unknown>>;
export interface TaggedObjectStructureDefinition extends DDataStructure.StructureDefinition<readonly []> {
    readonly inner: DDataStructure.ObjectStructure;
}
export type TaggedObjectMap<GenericValue extends unknown, GenericRawValue = DCommon.RemoveConstraint<GenericValue>> = GenericRawValue extends NewType ? NewTypeMap<GenericRawValue> : GenericRawValue extends object ? DCommon.Or<[
    DCommon.IsExtends<GenericRawValue, readonly any[]>,
    DCommon.And<[
        DCommon.IsExtends<keyof GenericRawValue, string>,
        DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericRawValue[keyof GenericRawValue]>>
    ]>
]> extends true ? {
    [Prop in keyof GenericRawValue]: TaggedObjectMap<GenericRawValue[Prop]>;
} : GenericRawValue : GenericRawValue;
export type TaggedObjectUpdate<GenericTaggedObject extends ObjectTag, GenericNewProperties extends object> = Extract<(ObjectTag<GetTagValue<GenericTaggedObject>> & DCommon.SimplifyTopLevel<DKind.Remove<GenericTaggedObject> extends infer InferredProperties ? {
    [Prop in keyof InferredProperties]: Prop extends keyof GenericNewProperties ? GenericNewProperties[Prop] extends infer InferredNewValue ? InferredNewValue extends undefined ? InferredProperties[Prop] : InferredNewValue : never : InferredProperties[Prop];
} : never>), any>;
export interface TaggedObjectStructure<out GenericTaggedObject extends ObjectTag = ObjectTag> extends DCommon.Forward<DDataStructure.Structure<GenericTaggedObject, TaggedObjectStructureDefinition> & DKind.Kind<typeof taggedObjectStructureKind>> {
    readonly name: GetTagValue<GenericTaggedObject>;
    "new"(properties: DCommon.SimplifyTopLevel<DKind.Remove<GenericTaggedObject>>): GenericTaggedObject;
    decodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs): (data: DDataStructure.EncodedValue<TaggedObjectMap<DKind.Remove<GenericTaggedObject>>, GenericCodecs>) => (DEither.Right<"map-success", GenericTaggedObject> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    decodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs, data: DDataStructure.EncodedValue<TaggedObjectMap<DKind.Remove<GenericTaggedObject>>, GenericCodecs>): (DEither.Right<"map-success", GenericTaggedObject> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    map(data: TaggedObjectMap<DKind.Remove<GenericTaggedObject>>): (DEither.Right<"map-success", GenericTaggedObject> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    asyncDecodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs): (data: DDataStructure.EncodedValue<TaggedObjectMap<DKind.Remove<GenericTaggedObject>>, GenericCodecs>) => Promise<DEither.Right<"map-success", GenericTaggedObject> | DEither.Left<"map-error", DDataStructure.Error>>;
    asyncDecodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs, data: DDataStructure.EncodedValue<TaggedObjectMap<DKind.Remove<GenericTaggedObject>>, GenericCodecs>): Promise<DEither.Right<"map-success", GenericTaggedObject> | DEither.Left<"map-error", DDataStructure.Error>>;
    asyncMap(data: TaggedObjectMap<DKind.Remove<GenericTaggedObject>>): Promise<DEither.Right<"map-success", GenericTaggedObject> | DEither.Left<"map-error", DDataStructure.Error>>;
    update<GenericInput extends GenericTaggedObject, const GenericPayload extends Partial<DKind.Remove<GenericTaggedObject>>>(update: GenericPayload): (input: GenericInput) => TaggedObjectUpdate<GenericInput, GenericPayload>;
    update<GenericInput extends GenericTaggedObject, const GenericPayload extends Partial<DKind.Remove<GenericTaggedObject>>>(input: GenericInput, update: GenericPayload): TaggedObjectUpdate<GenericInput, GenericPayload>;
}
export declare const TaggedObjectStructure: <GenericTaggedObject extends ObjectTag, GenericName extends string = never, GenericShape extends DDataStructure.ShapeObjectStructure = never>(name: GetTagValue<GenericTaggedObject> | GenericName, shape: ShapeTaggedObjectStructure<GenericTaggedObject> | GenericShape) => TaggedObjectStructure<ObjectTag extends GenericTaggedObject ? (ObjectTag<GenericName> & DDataStructure.ShapeObjectStructureValue<GenericShape>) : GenericTaggedObject>;
