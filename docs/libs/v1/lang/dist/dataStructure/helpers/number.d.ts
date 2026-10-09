import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
export declare function number<const GenericConstraints extends readonly Constraint<number>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<number, readonly [...GenericConstraints]>>;
