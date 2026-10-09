import { NotEmpty } from './constraints';
export declare function isNotEmpty<GenericValue extends string>(string: GenericValue): string is GenericValue & NotEmpty;
