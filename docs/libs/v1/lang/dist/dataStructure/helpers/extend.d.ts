import { ObjectStructure, ShapeObjectStructureValue, ShapeObjectStructure, StructureInitialValue } from '../structure';
import type * as DObject from '../../object';
export declare function extend<GenericObjectStructure extends ObjectStructure, GenericShape extends ShapeObjectStructure>(structure: GenericObjectStructure, shape: GenericShape): ObjectStructure<DObject.Assign<Extract<StructureInitialValue<GenericObjectStructure>, object>, ShapeObjectStructureValue<GenericShape>>, readonly []>;
