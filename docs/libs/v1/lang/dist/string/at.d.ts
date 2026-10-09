import { At } from './types';
export declare function at<GenericString extends string, GenericIndex extends number>(index: GenericIndex): (string: GenericString) => GenericString extends string ? At<GenericString, GenericIndex> : never;
export declare function at<GenericString extends string, GenericIndex extends number>(string: GenericString, index: GenericIndex): GenericString extends string ? At<GenericString, GenericIndex> : never;
