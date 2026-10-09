import { TypeStructure } from '../structure';
import { Constraint } from '../constraint';
export declare function bigint<const GenericConstraints extends readonly Constraint<bigint>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<bigint, readonly [...GenericConstraints]>>;
