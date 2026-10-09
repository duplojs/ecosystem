import { NotZero } from './constraints';
export declare function isNotZero<GenericNumber extends number>(number: GenericNumber): number is GenericNumber & NotZero;
