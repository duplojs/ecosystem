import { ReapplyCompatiblesConstraints } from './constraints';
type ConcatOutput<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[], GenericElementsRest extends readonly (readonly unknown[])[] = []> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericElements[number] | GenericElementsRest[number][number])[], "minElements"> : never;
export declare function concat<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]>(elements: GenericElements): (array: GenericArray) => ConcatOutput<GenericArray, GenericElements>;
export declare function concat<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[], GenericElementsRest extends readonly unknown[] = []>(array: GenericArray, elements: GenericElements, ...elementsRest: GenericElementsRest[]): ConcatOutput<GenericArray, GenericElements, GenericElementsRest[]>;
export {};
