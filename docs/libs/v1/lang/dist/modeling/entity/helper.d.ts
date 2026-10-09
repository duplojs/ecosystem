import { Entity, EntityStructure } from './base';
import { NewType } from '../newType';
import { ObjectTag } from '../taggedObject';
import type * as DCommon from '../../common';
import type * as DDataStructure from '../../dataStructure';
import type * as DString from '../../string';
export type ForbiddenMissingNewTypeInEntityShape<GenericValue extends unknown, GenericPath extends readonly string[] = readonly []> = GenericValue extends (ObjectTag | NewType | null | undefined | Entity) ? never : GenericValue extends readonly (infer InferredElement)[] ? ForbiddenMissingNewTypeInEntityShape<InferredElement, readonly [...GenericPath, "[number]"]> : GenericValue extends object ? DCommon.And<[
    DCommon.IsExtends<keyof GenericValue, string>,
    DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericValue[keyof GenericValue]>>
]> extends true ? {
    [Prop in keyof GenericValue]-?: ForbiddenMissingNewTypeInEntityShape<GenericValue[Prop], readonly [...GenericPath, `${Extract<Prop, string | number>}`]>;
}[keyof GenericValue] : DCommon.ComputedTypeError<`Value at '${DString.Join<GenericPath, ".">}' is not a NewType.`> : DCommon.ComputedTypeError<`Value at '${DString.Join<GenericPath, ".">}' is not a NewType.`>;
export declare function createEntity<GenericName extends Capitalize<string>, GenericShape extends DDataStructure.ShapeObjectStructure>(name: GenericName, shape: () => (GenericShape & DCommon.NeverCoalescing<ForbiddenMissingNewTypeInEntityShape<DDataStructure.ShapeObjectStructureValue<GenericShape>>, unknown>)): EntityStructure<GenericName, DDataStructure.ShapeObjectStructureValue<GenericShape & DCommon.NeverCoalescing<ForbiddenMissingNewTypeInEntityShape<DDataStructure.ShapeObjectStructureValue<GenericShape>, readonly []>, unknown>>>;
