import { Constraint } from '../constraint';
import { TypeStructure } from '../structure';
declare function nullHelper<const GenericConstraints extends readonly Constraint<null>[] = readonly []>(constraints?: GenericConstraints): NoInfer<TypeStructure<null, readonly [...GenericConstraints]>>;
export { nullHelper as null };
