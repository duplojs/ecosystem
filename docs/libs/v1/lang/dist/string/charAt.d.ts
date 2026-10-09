import { CharactersRange, AllowedCharacters, MaxCharacters } from './constraints';
import type * as DNumber from '../number';
type CharAtOutput<GenericString extends string> = GenericString extends AllowedCharacters<infer InferredCharactersRange extends CharactersRange> ? string & MaxCharacters<1> & AllowedCharacters<InferredCharactersRange> : string & MaxCharacters<1>;
export declare function charAt<GenericString extends string, GenericIndex extends number>(index: GenericIndex & DNumber.RequirePositiveInteger<GenericIndex>): (string: GenericString) => CharAtOutput<GenericString>;
export declare function charAt<GenericString extends string, GenericIndex extends number>(string: GenericString, index: GenericIndex & DNumber.RequirePositiveInteger<GenericIndex>): CharAtOutput<GenericString>;
export {};
