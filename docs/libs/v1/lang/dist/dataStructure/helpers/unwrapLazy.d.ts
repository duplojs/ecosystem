import { Structure, StructureValue } from '../structure';
export declare function unwrapLazy<GenericStructure extends Structure>(structure: GenericStructure): Structure<StructureValue<GenericStructure>>;
