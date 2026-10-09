import { Negative } from './constraints';
export declare function isNegative<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Negative;
