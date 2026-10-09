import { Constraint } from '../../constraint';
import { StructureDefinition, Structure } from '../base';
import { Codecs, EncodedValue } from '../../common';
import { StructureValue } from '../types';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
declare module "../../common" {
    interface EncodeStructure<GenericValue extends unknown, GenericCodecs extends Codecs> {
        array: GenericValue extends readonly (infer InferredElement)[] ? GenericValue extends DCommon.AnyTuple ? never : readonly EncodedValue<InferredElement, GenericCodecs>[] : never;
    }
}
export declare const arrayStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/array-structure", unknown>>;
export interface ArrayStructureDefinition<GenericConstraints extends readonly Constraint[] = readonly Constraint[]> extends StructureDefinition<GenericConstraints> {
    readonly element: Structure;
}
export interface ArrayStructure<out GenericValue extends readonly unknown[] = readonly unknown[], out GenericConstraints extends readonly Constraint<GenericValue>[] = readonly Constraint<GenericValue>[]> extends DCommon.Forward<Structure<GenericValue, ArrayStructureDefinition<GenericConstraints>> & DKind.Kind<typeof arrayStructureKind>> {
}
export declare const ArrayStructure: <GenericElement extends Structure, const GenericConstraints extends readonly Constraint<readonly StructureValue<GenericElement>[]>[]>(element: GenericElement, constraints: GenericConstraints) => NoInfer<ArrayStructure<readonly StructureValue<GenericElement>[], readonly [...GenericConstraints]>>;
