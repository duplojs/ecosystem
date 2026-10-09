import { IsGreater } from './isGreater';
import type * as DCommon from '../../common';
export type IsLessOrEqual<GenericValue extends number, GenericReference extends number> = DCommon.IsEqual<GenericValue, GenericReference> extends true ? true : DCommon.Not<IsGreater<GenericValue, GenericReference>>;
export type IsLess<GenericValue extends number, GenericReference extends number> = DCommon.Not<DCommon.IsEqual<GenericValue, GenericReference>> extends true ? DCommon.Not<IsGreater<GenericValue, GenericReference>> : false;
