import { Positive } from './constraints';
export declare function isPositive<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Positive;
