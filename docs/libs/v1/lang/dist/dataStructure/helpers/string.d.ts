import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
export declare function string<const GenericConstraints extends readonly Constraint<string>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<string, readonly [...GenericConstraints]>>;
