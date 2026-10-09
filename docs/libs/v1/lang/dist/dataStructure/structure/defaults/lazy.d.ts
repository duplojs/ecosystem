import { Constraint } from '../../constraint';
import { StructureDefinition, Structure } from '../base';
import { StructureValue } from '../types';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
export declare const lazyStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/lazy-structure", unknown>>;
export interface LazyStructureDefinition<GenericConstraints extends readonly Constraint[] = readonly Constraint[]> extends StructureDefinition<GenericConstraints> {
    readonly getter: DCommon.Memoized<Structure>;
}
export interface LazyStructure<out GenericValue extends unknown = unknown, out GenericConstraints extends readonly Constraint<GenericValue>[] = readonly Constraint<GenericValue>[]> extends DCommon.Forward<Structure<GenericValue, LazyStructureDefinition<GenericConstraints>> & DKind.Kind<typeof lazyStructureKind>> {
}
export declare const LazyStructure: <GenericStructure extends Structure, const GenericConstraints extends readonly Constraint<StructureValue<GenericStructure>>[]>(getStructure: () => GenericStructure, constraints: GenericConstraints) => NoInfer<LazyStructure<StructureValue<GenericStructure>, readonly [...GenericConstraints]>>;
