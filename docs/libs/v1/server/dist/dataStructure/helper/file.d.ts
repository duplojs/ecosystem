import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
export declare function file<const GenericConstraints extends readonly DDataStructure.Constraint<DSFile.FileInterface>[] = readonly []>(constraints?: GenericConstraints): NoInfer<DDataStructure.TypeStructure<DSFile.FileInterface, readonly [...GenericConstraints]>>;
