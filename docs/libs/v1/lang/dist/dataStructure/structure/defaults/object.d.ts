import { Constraint } from '../../constraint';
import { StructureDefinition, Structure } from '../base';
import { StructureValue } from '../types';
import { Codecs, EncodedValue } from '../../common';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
import * as DObject from '../../../object';
declare module "../../common" {
    interface EncodeStructure<GenericValue extends unknown, GenericCodecs extends Codecs> {
        object: GenericValue extends object ? keyof GenericValue extends string ? {
            [Prop in keyof GenericValue]: EncodedValue<GenericValue[Prop], GenericCodecs>;
        } : never : never;
    }
}
export type ShapeObjectStructure = Record<string, Structure>;
export interface EntryShapeObjectStructure {
    key: string;
    value: Structure;
}
export type ShapeObjectStructureValue<GenericShape extends ShapeObjectStructure> = {
    readonly [Prop in keyof GenericShape]: StructureValue<GenericShape[Prop]>;
} extends infer InferredResult extends Record<string, unknown> ? DObject.PartialKeys<InferredResult, DObject.GetPropsWithValueExtends<InferredResult, undefined>> : never;
export declare const objectStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/object-structure", unknown>>;
export interface ObjectStructureDefinition<GenericConstraints extends readonly Constraint[] = readonly Constraint[]> extends StructureDefinition<GenericConstraints> {
    readonly optimizedShape: DCommon.Memoized<readonly EntryShapeObjectStructure[]>;
    readonly shape: Readonly<Record<string, Structure>>;
    readonly keys: readonly string[];
}
export interface ObjectStructure<out GenericValue extends Record<string, unknown> = Record<string, unknown>, out GenericConstraints extends readonly Constraint<GenericValue>[] = readonly Constraint<GenericValue>[]> extends DCommon.Forward<Structure<GenericValue, ObjectStructureDefinition<GenericConstraints>> & DKind.Kind<typeof objectStructureKind>> {
}
export declare const ObjectStructure: <GenericShape extends ShapeObjectStructure, const GenericConstraints extends readonly Constraint<ShapeObjectStructureValue<GenericShape>>[]>(shape: GenericShape, constraints: GenericConstraints) => NoInfer<ObjectStructure<ShapeObjectStructureValue<GenericShape>, readonly [...GenericConstraints]>>;
