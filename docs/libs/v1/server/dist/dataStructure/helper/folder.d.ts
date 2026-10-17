import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from '../../file';
export declare function folder<const GenericConstraints extends readonly DDataStructure.Constraint<DSFile.FolderInterface>[] = readonly []>(constraints?: GenericConstraints): NoInfer<DDataStructure.TypeStructure<DSFile.FolderInterface<DSFile.EntryPath>, readonly [...GenericConstraints]>>;
