import { NewType, NewTypeMap } from '../newType';
import type * as DKind from '../../kind';
import * as DCommon from '../../common';
import * as DDataStructure from '../../dataStructure';
import * as DEither from '../../either';
import * as DObject from '../../object';
declare module '../../dataStructure' {
    interface StructuresStore {
        entity: EntityStructure;
    }
}
declare module '../../dataStructure/common' {
    interface EncodeStructure<GenericValue extends unknown, GenericCodecs extends DDataStructure.Codecs> {
        entity: GenericValue extends Entity<infer InferredName> ? (Entity<InferredName> & {
            [Prop in Exclude<keyof GenericValue, DKind.KeySymbol>]: DDataStructure.EncodedValue<GenericValue[Prop], GenericCodecs>;
        }) : never;
    }
}
export declare const entityKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/entity", string>>;
export interface Entity<GenericName extends string = string> extends DKind.Kind<typeof entityKind, GenericName> {
}
export type GetEntityName<GenericEntity extends Entity> = GenericEntity extends Entity<infer InferredName> ? InferredName : never;
export type ExtractByEntityName<GenericValue extends unknown, GenericEntityName extends string> = GenericValue extends Entity<GenericEntityName> ? GenericValue : never;
export declare const entityStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/entity-structure", unknown>>;
export interface EntityStructureDefinition extends DDataStructure.StructureDefinition<readonly []> {
    readonly inner: DCommon.Memoized<DDataStructure.ObjectStructure>;
}
export type EntityMap<GenericValue extends unknown, GenericRawValue = DCommon.RemoveConstraint<GenericValue>> = GenericRawValue extends NewType ? NewTypeMap<GenericRawValue> : GenericRawValue extends object ? DCommon.Or<[
    DCommon.IsExtends<GenericRawValue, readonly any[]>,
    DCommon.And<[
        DCommon.IsExtends<keyof GenericRawValue, string>,
        DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericRawValue[keyof GenericRawValue]>>
    ]>
]> extends true ? {
    [Prop in keyof GenericRawValue]: EntityMap<GenericRawValue[Prop]>;
} : GenericRawValue : GenericRawValue;
export type EntityUpdate<GenericEntity extends Entity, GenericNewProperties extends object> = Extract<(Entity<GetEntityName<GenericEntity>> & DCommon.SimplifyTopLevel<DKind.Remove<GenericEntity> extends infer InferredProperties ? {
    [Prop in keyof InferredProperties]: Prop extends keyof GenericNewProperties ? GenericNewProperties[Prop] extends infer InferredNewValue ? InferredNewValue extends undefined ? InferredProperties[Prop] : InferredNewValue : never : InferredProperties[Prop];
} : never>), any>;
type ForbiddenMoreKey<GenericProperties extends Record<string, unknown>, GenericNewProperties extends Record<string, unknown>> = DObject.ForbiddenKey<GenericNewProperties, Extract<Exclude<keyof GenericNewProperties, keyof GenericProperties>, string>>;
export interface EntityStructure<out GenericName extends string = string, out GenericProperties extends Record<string, unknown> = Record<string, unknown>> extends DCommon.Forward<DDataStructure.Structure<Entity<GenericName> & GenericProperties, EntityStructureDefinition> & DKind.Kind<typeof entityStructureKind>> {
    readonly name: GenericName;
    "new"<GenericNewProperties extends GenericProperties>(properties: (GenericNewProperties & ForbiddenMoreKey<GenericProperties, GenericNewProperties>)): (Entity<GenericName> & DCommon.SimplifyTopLevel<Readonly<GenericNewProperties>>);
    decodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs): (data: DDataStructure.EncodedValue<EntityMap<GenericProperties>, GenericCodecs>) => (DEither.Right<"map-success", Entity<GenericName> & GenericProperties> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    decodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs, data: DDataStructure.EncodedValue<EntityMap<GenericProperties>, GenericCodecs>): (DEither.Right<"map-success", Entity<GenericName> & GenericProperties> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    map(data: EntityMap<GenericProperties>): (DEither.Right<"map-success", Entity<GenericName> & GenericProperties> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    asyncDecodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs): (data: DDataStructure.EncodedValue<EntityMap<GenericProperties>, GenericCodecs>) => Promise<DEither.Right<"map-success", Entity<GenericName> & GenericProperties> | DEither.Left<"map-error", DDataStructure.Error>>;
    asyncDecodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs, data: DDataStructure.EncodedValue<EntityMap<GenericProperties>, GenericCodecs>): Promise<DEither.Right<"map-success", Entity<GenericName> & GenericProperties> | DEither.Left<"map-error", DDataStructure.Error>>;
    asyncMap(data: EntityMap<GenericProperties>): Promise<DEither.Right<"map-success", Entity<GenericName> & GenericProperties> | DEither.Left<"map-error", DDataStructure.Error>>;
    update<GenericInputEntity extends (Entity<GenericName> & GenericProperties), const GenericPayload extends Partial<GenericProperties>>(update: GenericPayload): (input: GenericInputEntity) => EntityUpdate<GenericInputEntity, GenericPayload>;
    update<GenericInputEntity extends (Entity<GenericName> & GenericProperties), const GenericPayload extends Partial<GenericProperties>>(input: GenericInputEntity, update: GenericPayload): EntityUpdate<GenericInputEntity, GenericPayload>;
}
export declare const EntityStructure: <GenericName extends string, GenericShape extends DDataStructure.ShapeObjectStructure, const GenericProperties extends DDataStructure.ShapeObjectStructureValue<GenericShape>>(name: GenericName, shape: () => GenericShape) => EntityStructure<GenericName, GenericProperties>;
export {};
