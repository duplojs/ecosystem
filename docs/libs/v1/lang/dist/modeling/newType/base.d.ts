import type * as DKind from '../../kind';
import * as DCommon from '../../common';
import type * as DArray from '../../array';
import * as DEither from '../../either';
import * as DDataStructure from '../../dataStructure';
declare module '../../dataStructure' {
    interface StructuresStore {
        newType: NewTypeStructure;
    }
}
export interface NewType<GenericName extends string = string, GenericConstraint extends DCommon.Constraint = never> extends DCommon.BaseConstraint<DCommon.SimplifyType<Record<"new-type", GenericName> & DCommon.UnionToIntersection<GenericConstraint[DCommon.ConstraintSymbol]>>> {
}
export type NewTypeMap<GenericValue extends unknown, GenericRawValue = DCommon.RemoveConstraint<GenericValue>> = GenericRawValue extends DDataStructure.FundamentalTypeValue<DDataStructure.FundamentalTypes> ? GenericRawValue : GenericRawValue extends object ? DCommon.Or<[
    DCommon.IsExtends<GenericRawValue, readonly any[]>,
    DCommon.And<[
        DCommon.IsExtends<keyof GenericRawValue, string>,
        DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericRawValue[keyof GenericRawValue]>>
    ]>
]> extends true ? {
    [Prop in keyof GenericRawValue]: NewTypeMap<GenericRawValue[Prop]>;
} : GenericRawValue : GenericRawValue;
export declare const newTypeStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/new-type-structure", unknown>>;
export interface NewTypeStructureDefinition<GenericNewTypeConstraint extends readonly DDataStructure.Constraint[] = readonly DDataStructure.Constraint[]> extends DDataStructure.StructureDefinition<readonly []> {
    readonly inner: DDataStructure.Structure;
    readonly newTypeConstraints: GenericNewTypeConstraint;
}
export type ComputeNewType<GenericName extends string, GenericValue extends unknown, GenericNewTypeConstraint extends readonly DDataStructure.Constraint<GenericValue>[], GenericIntersectionConstraintValue = DDataStructure.ConstraintValue<DArray.Unwrap<GenericNewTypeConstraint>>, GenericClearValue = DCommon.NeverCoalescing<DCommon.RemoveConstraint<GenericIntersectionConstraintValue>, unknown>> = Extract<GenericValue & GenericClearValue & NewType<GenericName, GenericIntersectionConstraintValue extends (GenericClearValue & infer InferredConstraint extends DCommon.BaseConstraint) ? InferredConstraint : never>, any>;
export interface NewTypeStructure<out GenericName extends string = string, out GenericValue extends unknown = unknown, out GenericNewTypeConstraint extends readonly DDataStructure.Constraint<GenericValue>[] = readonly DDataStructure.Constraint<GenericValue>[]> extends DCommon.Forward<DDataStructure.Structure<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>, NewTypeStructureDefinition<GenericNewTypeConstraint>> & DKind.Kind<typeof newTypeStructureKind>> {
    readonly name: GenericName;
    decodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs): (data: DDataStructure.EncodedValue<NewTypeMap<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>>, GenericCodecs>) => (DEither.Right<"map-success", ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    decodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs, data: DDataStructure.EncodedValue<NewTypeMap<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>>, GenericCodecs>): (DEither.Right<"map-success", ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    map(data: NewTypeMap<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>>): (DEither.Right<"map-success", ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>> | DEither.Left<"async-error", DDataStructure.ErrorPromise> | DEither.Left<"map-error", DDataStructure.Error>);
    asyncDecodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs): (data: DDataStructure.EncodedValue<NewTypeMap<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>>, GenericCodecs>) => Promise<DEither.Right<"map-success", ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>> | DEither.Left<"map-error", DDataStructure.Error>>;
    asyncDecodeMap<GenericCodecs extends DDataStructure.Codecs>(codecs: GenericCodecs, data: DDataStructure.EncodedValue<NewTypeMap<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>>, GenericCodecs>): Promise<DEither.Right<"map-success", ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>> | DEither.Left<"map-error", DDataStructure.Error>>;
    asyncMap(data: NewTypeMap<ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>>): Promise<DEither.Right<"map-success", ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>> | DEither.Left<"map-error", DDataStructure.Error>>;
}
export declare const NewTypeStructure: <GenericName extends string, GenericStructure extends DDataStructure.Structure, const GenericNewTypeConstraint extends readonly DDataStructure.Constraint<DDataStructure.StructureValue<GenericStructure>>[]>(name: GenericName, structure: GenericStructure, newTypeConstraints: GenericNewTypeConstraint) => NewTypeStructure<GenericName, DDataStructure.StructureValue<GenericStructure>, GenericNewTypeConstraint>;
