import { Last } from './types';
export declare function last<GenericString extends string>(string: GenericString): GenericString extends unknown ? Last<GenericString> : never;
