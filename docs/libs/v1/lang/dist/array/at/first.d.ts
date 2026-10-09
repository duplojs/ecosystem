import { At } from './default';
export type First<GenericArray extends readonly unknown[]> = At<GenericArray, 0>;
export declare function first<GenericArray extends readonly unknown[]>(array: GenericArray): First<GenericArray>;
