import { StrictPositive } from './constraints';
export declare function isStrictPositive<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & StrictPositive;
