import { Url } from './constraints';
export declare function isUrl<GenericValue extends string>(string: GenericValue): string is GenericValue & Url;
