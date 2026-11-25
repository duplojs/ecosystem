import { Path } from './constraints';
import { RequireLiteralPath } from './types';
export declare function declarePath<const GenericValue extends string>(value: (GenericValue & RequireLiteralPath<GenericValue>)): GenericValue & Path;
