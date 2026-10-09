import { UnionStructure, Structure, StructureValue } from '../structure';
import { Constraint } from '../constraint';
import type * as DCommon from '../../common';
export declare function union<GenericValues extends DCommon.AnyTuple<Structure>, const GenericConstraints extends readonly Constraint<StructureValue<GenericValues[number]>>[] = readonly []>(values: GenericValues, constraints?: GenericConstraints): NoInfer<UnionStructure<StructureValue<GenericValues[number]>, readonly [...GenericConstraints]>>;
