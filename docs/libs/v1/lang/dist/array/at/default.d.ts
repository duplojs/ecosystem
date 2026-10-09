import { IsIndexCovered, IsIndexOutOfRange } from '../constraints';
export type At<GenericArray extends readonly unknown[], GenericIndex extends number> = GenericArray extends unknown ? IsIndexOutOfRange<GenericArray, GenericIndex> extends true ? undefined : IsIndexCovered<GenericArray, GenericIndex> extends true ? GenericArray[number] : GenericArray[number] | undefined : never;
export declare function at<GenericArray extends readonly unknown[], GenericIndex extends number>(index: GenericIndex): (array: GenericArray) => At<GenericArray, GenericIndex>;
export declare function at<GenericArray extends readonly unknown[], GenericIndex extends number>(array: GenericArray, index: GenericIndex): At<GenericArray, GenericIndex>;
