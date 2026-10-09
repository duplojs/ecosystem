import { Left, None } from './left';
import { Some, Right } from './right';
type Either = Right | Left;
export declare function toMaybe<GenericInput extends unknown>(input: GenericInput): (GenericInput extends Either ? GenericInput : GenericInput extends null | undefined ? None : Some<GenericInput>);
export {};
