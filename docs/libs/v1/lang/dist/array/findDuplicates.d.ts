import { MinElements } from './constraints';
import * as DChrono from '../chrono';
export type EligibleDuplicateElement = (string | boolean | null | number | bigint | undefined | DChrono.TheDate | DChrono.TheTime);
export declare function findDuplicates<GenericArray extends readonly EligibleDuplicateElement[]>(array: GenericArray): undefined | (readonly GenericArray[number][] & MinElements<1>);
