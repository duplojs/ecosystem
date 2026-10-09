import { ObjectStructure, StructureInitialValue } from '../structure';
import type * as DCommon from '../../common';
export declare function required<GenericObjectStructure extends ObjectStructure, GenericObjectStructureValue extends StructureInitialValue<GenericObjectStructure>>(structure: GenericObjectStructure): ObjectStructure<{
    readonly [Prop in keyof GenericObjectStructureValue]-?: DCommon.IsEqual<GenericObjectStructureValue[Prop], undefined> extends true ? undefined : Exclude<GenericObjectStructureValue[Prop], undefined>;
}, readonly []>;
