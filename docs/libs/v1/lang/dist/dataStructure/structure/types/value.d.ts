import { structureKind, Structure } from '../base';
import { StructureConstraintsValue } from './constraintsValue';
import { Constraint } from '../../constraint';
import type * as DKind from '../../../kind';
export type StructureValue<GenericStructure extends Structure> = DKind.GetValue<typeof structureKind, GenericStructure>;
export type StructureInitialValue<GenericStructure extends Structure, GenericStructureValue = StructureValue<GenericStructure>> = GenericStructureValue extends unknown ? GenericStructureValue extends (infer InferredInitialValue) & StructureConstraintsValue<GenericStructure["definition"]["constraints"][number]> ? InferredInitialValue : GenericStructureValue : never;
export type ComputeStructureValue<GenericValue extends unknown, GenericConstraints extends readonly Constraint[]> = Extract<GenericValue & StructureConstraintsValue<GenericConstraints[number]>, any>;
