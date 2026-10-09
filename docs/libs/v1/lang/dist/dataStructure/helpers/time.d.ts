import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
import type * as DChrono from '../../chrono';
export declare function time<const GenericConstraints extends readonly Constraint<DChrono.TheTime>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<DChrono.TheTime, readonly [...GenericConstraints]>>;
