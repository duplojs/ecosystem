import { Constraint } from '../constraint';
import { LazyStructure, StructureValue, Structure } from '../structure';
export declare function lazy<GenericStructure extends Structure, const GenericConstraints extends readonly Constraint<StructureValue<GenericStructure>>[] = readonly []>(getStructure: () => GenericStructure, constraints?: GenericConstraints): NoInfer<LazyStructure<StructureValue<GenericStructure>, readonly [...GenericConstraints]>>;
