import { Safe } from './constraints';
export declare function isSafe<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Safe;
