import { Integer } from './constraints';
export declare function isInteger<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Integer;
