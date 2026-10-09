import { ReapplyCompatiblesConstraints } from './constraints';
type PopOutput<GenericArray extends readonly unknown[]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][], "maxElements"> : never;
export declare function pop<GenericArray extends readonly unknown[]>(array: GenericArray): PopOutput<GenericArray>;
export {};
