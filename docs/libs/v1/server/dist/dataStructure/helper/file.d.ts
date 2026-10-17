import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from '../../file';
export declare function file<const GenericConstraints extends readonly DDataStructure.Constraint<DSFile.FileInterface>[] = readonly []>(constraints?: GenericConstraints): NoInfer<DDataStructure.TypeStructure<DSFile.FileInterface<DSFile.EntryPath>, readonly [...GenericConstraints]>>;
