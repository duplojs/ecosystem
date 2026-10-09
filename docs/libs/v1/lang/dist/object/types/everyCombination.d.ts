import { Split } from './split';
import type * as DCommon from '../../common';
type AddShape<GenericSplitShape extends object, GenericAccumulator extends object, GenericLast extends object> = LoopWhileHasShape<Exclude<GenericSplitShape, GenericLast>, GenericAccumulator | (GenericAccumulator & GenericLast)>;
type LoopWhileHasShape<GenericSplitShape extends object, GenericAccumulator extends object = GenericSplitShape> = DCommon.IsNever<GenericSplitShape> extends true ? GenericAccumulator : AddShape<GenericSplitShape, GenericAccumulator, DCommon.LastUnionElement<GenericSplitShape>>;
export type EveryCombination<GenericValue extends object, GenericSplitMax extends number = 10> = Extract<DCommon.SimplifyTypeForce<LoopWhileHasShape<Split<GenericValue, GenericSplitMax>>>, object>;
export {};
