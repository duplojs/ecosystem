import { Negative } from './constraints';
export declare function isStrictNegative<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Negative;
