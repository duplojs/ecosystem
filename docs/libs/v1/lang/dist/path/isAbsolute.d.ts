import { Absolute } from './constraints';
import { IsLiteralAbsolutePath } from './types';
import type * as DString from '../string';
export declare function isAbsolute<GenericPath extends string>(value: GenericPath): value is (GenericPath extends Absolute ? GenericPath : IsLiteralAbsolutePath<GenericPath> extends true ? GenericPath : DString.IsLiteral<GenericPath> extends true ? never : GenericPath & Absolute);
