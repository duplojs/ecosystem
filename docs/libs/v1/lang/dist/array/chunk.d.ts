import { MaxElements, MinElements } from './constraints';
import * as DNumber from '../number';
type ChunkOutput<GenericArray extends readonly unknown[], GenericSize extends number> = Extract<readonly (readonly GenericArray[number][] & MinElements<1> & (DNumber.IsPositiveInteger<GenericSize> extends true ? MaxElements<GenericSize> : unknown))[], any>;
export declare function chunk<GenericArray extends readonly unknown[], GenericSize extends number>(size: GenericSize): (array: GenericArray) => ChunkOutput<GenericArray, GenericSize>;
export declare function chunk<GenericArray extends readonly unknown[], GenericSize extends number>(array: GenericArray, size: GenericSize): ChunkOutput<GenericArray, GenericSize>;
export {};
