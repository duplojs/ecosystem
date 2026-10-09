import { ReapplyCompatiblesConstraints } from '../constraints';
type FillAllOutput<GenericArray extends readonly unknown[], GenericElement extends unknown> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericElement[]> : never;
export declare function fillAll<GenericElement extends unknown>(element: GenericElement): <GenericArray extends readonly unknown[]>(array: GenericArray) => FillAllOutput<GenericArray, GenericElement>;
export declare function fillAll<GenericElement extends unknown, GenericArray extends readonly unknown[]>(array: GenericArray, element: GenericElement): FillAllOutput<GenericArray, GenericElement>;
export {};
