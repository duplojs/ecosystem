import { Absolute, Path } from './constraints';
import { IsLiteralPath } from './types';
import type * as DString from '../string';
export declare function is<GenericPath extends string>(value: GenericPath): value is (GenericPath extends (Path | Absolute) ? GenericPath : IsLiteralPath<GenericPath> extends true ? GenericPath : DString.IsLiteral<GenericPath> extends true ? never : GenericPath & Path);
