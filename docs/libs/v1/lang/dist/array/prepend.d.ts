import { ReapplyCompatiblesConstraints } from './constraints';
type PrependOutput<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[], GenericElementsRest extends readonly unknown[][] = []> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly (GenericElements[number] | GenericElementsRest[number][number] | GenericArray[number])[], "minElements"> : never;
export declare function prepend<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]>(elements: GenericElements): (array: GenericArray) => PrependOutput<GenericArray, GenericElements>;
export declare function prepend<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[], GenericElementsRest extends readonly unknown[][]>(array: GenericArray, elements: GenericElements, ...elementsRest: GenericElementsRest): PrependOutput<GenericArray, GenericElements, GenericElementsRest>;
export {};
