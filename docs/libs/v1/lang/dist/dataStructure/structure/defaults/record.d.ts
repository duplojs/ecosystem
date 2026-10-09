import { Constraint } from '../../constraint';
import { StructureDefinition, Structure } from '../base';
import { StructureValue } from '../types';
import { UnionStructure } from './union';
import { TypeStructure } from './type';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
export type RecordStructureValue<GenericKey extends Structure<string>, GenericValue extends Structure> = {
    readonly [Prop in StructureValue<GenericKey>]: StructureValue<GenericValue>;
} extends infer InferredResult extends Record<string, unknown> ? {} extends InferredResult ? Partial<InferredResult> : undefined extends InferredResult[keyof InferredResult] ? Partial<InferredResult> : InferredResult : never;
export declare const recordStructureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/record-structure", unknown>>;
export interface RecordStructureDefinition<GenericConstraints extends readonly Constraint[] = readonly Constraint[]> extends StructureDefinition<GenericConstraints> {
    readonly key: UnionStructure<string> | TypeStructure<string>;
    readonly value: Structure;
    readonly requiredKeys: DCommon.Memoized<string[] | null>;
}
export interface RecordStructure<out GenericValue extends Record<string, unknown> = Record<string, unknown>, out GenericConstraints extends readonly Constraint<GenericValue>[] = readonly Constraint<GenericValue>[]> extends DCommon.Forward<Structure<GenericValue, RecordStructureDefinition<GenericConstraints>> & DKind.Kind<typeof recordStructureKind>> {
}
export declare const RecordStructure: <GenericKey extends (UnionStructure<string> | TypeStructure<string>), GenericValueStructure extends Structure, const GenericConstraints extends readonly Constraint<RecordStructureValue<GenericKey, GenericValueStructure>>[]>(key: GenericKey, value: GenericValueStructure, constraints: GenericConstraints) => NoInfer<RecordStructure<RecordStructureValue<GenericKey, GenericValueStructure>, readonly [...GenericConstraints]>>;
