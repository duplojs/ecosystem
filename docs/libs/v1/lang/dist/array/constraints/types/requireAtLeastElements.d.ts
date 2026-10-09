import { HasAtLeastElements } from './hasAtLeastElements';
import type * as DCommon from '../../../common';
export type RequireAtLeastElements<GenericArray extends readonly unknown[], GenericMin extends number> = HasAtLeastElements<GenericArray, GenericMin> extends true ? unknown : DCommon.ComputedTypeError<`Array must have at least ${GenericMin} elements.`>;
