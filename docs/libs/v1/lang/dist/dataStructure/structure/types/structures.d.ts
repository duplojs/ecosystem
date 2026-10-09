import { Structure } from '../base';
import { ObjectStructure, ArrayStructure, LazyStructure, RecordStructure, UnionStructure, TypeStructure, NonEncodableStringStructure } from '../defaults';
export interface StructuresStore {
    base: Structure;
    array: ArrayStructure;
    lazy: LazyStructure;
    object: ObjectStructure;
    record: RecordStructure;
    union: UnionStructure;
    type: TypeStructure;
    nonEncodableString: NonEncodableStringStructure;
}
export type Structures = Extract<StructuresStore[keyof StructuresStore], Structure>;
