import { Path, Absolute } from './constraints';
import { RequireLiteralAbsolutePath } from './types';
export declare function declareAbsolutePath<const GenericValue extends string>(value: (GenericValue & RequireLiteralAbsolutePath<GenericValue>)): GenericValue & Absolute & Path;
