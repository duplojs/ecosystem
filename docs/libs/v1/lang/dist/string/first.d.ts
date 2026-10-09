import { First } from './types';
export declare function first<GenericString extends string>(string: GenericString): GenericString extends unknown ? First<GenericString> : never;
