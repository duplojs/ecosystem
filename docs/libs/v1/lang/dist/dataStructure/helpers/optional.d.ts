import { Structure, StructureInitialValue, StructureValue, UnionStructure } from '../structure';
export declare function optional<GenericStructure extends Structure>(structure: GenericStructure): UnionStructure<(GenericStructure extends UnionStructure ? StructureInitialValue<GenericStructure> : StructureValue<GenericStructure>) | undefined, readonly []>;
