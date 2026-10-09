import { Odd } from './constraints';
export declare function isOdd<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Odd;
