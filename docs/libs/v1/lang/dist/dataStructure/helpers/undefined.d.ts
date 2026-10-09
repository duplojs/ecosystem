import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
declare function undefinedHelper<const GenericConstraints extends readonly Constraint<undefined>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<undefined, readonly [...GenericConstraints]>>;
export { undefinedHelper as undefined };
