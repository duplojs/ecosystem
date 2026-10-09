import { Path } from './constraints';
import { RequireLiteralPath } from './types';
export declare function declarePath<GenericValue extends string>(value: (GenericValue & RequireLiteralPath<GenericValue>)): GenericValue & Path;
