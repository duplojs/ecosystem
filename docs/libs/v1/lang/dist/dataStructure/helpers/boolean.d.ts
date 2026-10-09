import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
export declare function boolean<const GenericConstraints extends readonly Constraint<boolean>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<boolean, readonly [...GenericConstraints]>>;
