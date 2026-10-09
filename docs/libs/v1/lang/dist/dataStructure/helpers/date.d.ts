import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
import type * as DChrono from '../../chrono';
export declare function date<const GenericConstraints extends readonly Constraint<DChrono.TheDate>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<DChrono.TheDate, readonly [...GenericConstraints]>>;
