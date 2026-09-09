import { type Structure } from "../base";
import { type ObjectStructure, type ArrayStructure, type LazyStructure, type RecordStructure, type UnionStructure, type TypeStructure, type NonEncodableStringStructure } from "../defaults";

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

export type Structures = Extract<
	StructuresStore[keyof StructuresStore],
	Structure
>;
