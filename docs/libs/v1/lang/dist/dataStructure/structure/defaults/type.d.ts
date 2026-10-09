import { Constraint } from '../../constraint';
import { TypeValue, Type } from '../../type';
import { StructureDefinition, Structure } from '../base';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
export declare const typeStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/type-structure", unknown>>;
export interface TypeStructureDefinition<GenericConstraints extends readonly Constraint[] = readonly Constraint[]> extends StructureDefinition<GenericConstraints> {
    readonly type: Type;
}
export interface TypeStructure<out GenericType extends unknown = unknown, out GenericConstraints extends readonly Constraint<GenericType>[] = readonly Constraint<GenericType>[]> extends DCommon.Forward<Structure<GenericType, TypeStructureDefinition<GenericConstraints>> & DKind.Kind<typeof typeStructureKind>> {
}
export declare const TypeStructure: <GenericType extends Type, const GenericConstraints extends readonly Constraint<TypeValue<GenericType>>[]>(type: GenericType, constraints: GenericConstraints) => NoInfer<TypeStructure<TypeValue<GenericType>, readonly [...GenericConstraints]>>;
