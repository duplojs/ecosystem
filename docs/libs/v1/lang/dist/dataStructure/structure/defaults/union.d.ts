import { Constraint } from '../../constraint';
import { StructureDefinition, Structure } from '../base';
import { StructureValue } from '../types';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
export declare const unionStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/union-structure", unknown>>;
export interface UnionStructureDefinition<GenericConstraints extends readonly Constraint[] = readonly Constraint[]> extends StructureDefinition<GenericConstraints> {
    readonly values: DCommon.Memoized<DCommon.AnyTuple<Structure>>;
}
export interface UnionStructure<out GenericValue extends unknown = unknown, out GenericConstraints extends readonly Constraint<GenericValue>[] = readonly Constraint<GenericValue>[]> extends DCommon.Forward<Structure<GenericValue, UnionStructureDefinition<GenericConstraints>> & DKind.Kind<typeof unionStructureKind>> {
}
export declare const UnionStructure: <GenericValues extends DCommon.AnyTuple<Structure>, const GenericConstraints extends readonly Constraint<StructureValue<GenericValues[number]>>[]>(values: GenericValues, constraints: GenericConstraints) => NoInfer<UnionStructure<StructureValue<GenericValues[number]>, readonly [...GenericConstraints]>>;
