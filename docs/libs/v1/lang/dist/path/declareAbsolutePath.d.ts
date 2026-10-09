import { Absolute } from './constraints';
import { RequireLiteralAbsolutePath } from './types';
export declare function declareAbsolutePath<GenericValue extends string>(value: (GenericValue & RequireLiteralAbsolutePath<GenericValue>)): GenericValue & Absolute;
