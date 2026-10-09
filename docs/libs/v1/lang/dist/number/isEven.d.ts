import { Even } from './constraints';
export declare function isEven<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & Even;
