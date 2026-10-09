import { Constraint } from '../constraint';
import { ArrayStructure, StructureValue, Structure } from '../structure';
export declare function array<GenericStructure extends Structure, const GenericConstraints extends readonly Constraint<readonly StructureValue<GenericStructure>[]>[] = readonly []>(element: GenericStructure, constraints?: GenericConstraints): NoInfer<ArrayStructure<readonly StructureValue<GenericStructure>[], readonly [...GenericConstraints]>>;
