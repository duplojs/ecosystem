import { ObjectStructure, StructureInitialValue } from '../structure';
export declare function partial<GenericObjectStructure extends ObjectStructure, GenericObjectStructureValue extends StructureInitialValue<GenericObjectStructure>>(structure: GenericObjectStructure): ObjectStructure<{
    readonly [Prop in keyof GenericObjectStructureValue]?: (GenericObjectStructureValue[Prop] | undefined);
}, readonly []>;
