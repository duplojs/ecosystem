import { Number } from './constraints';
import { NumberInString } from './types';
type ComputeResult<GenericValue extends string> = GenericValue extends Number ? GenericValue : GenericValue extends NumberInString ? GenericValue : GenericValue & Number;
export declare function isNumber<GenericValue extends string>(string: GenericValue): string is ComputeResult<GenericValue>;
export {};
