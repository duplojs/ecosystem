import { AllowedCharacters, CharactersRange } from './constraints';
import type * as DCommon from '../common';
declare module "./constraints" {
    interface CharactersRangeStore {
        "a-z": "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
        "A-Z": "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
        "0-9": "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    }
}
export declare function isComposedOf<GenericCharactersRange extends CharactersRange>(charactersRange: DCommon.MaybeArray<GenericCharactersRange>): (value: string) => value is string & AllowedCharacters<GenericCharactersRange>;
export declare function isComposedOf<GenericCharactersRange extends CharactersRange>(value: string, charactersRange: DCommon.MaybeArray<GenericCharactersRange>): value is string & AllowedCharacters<GenericCharactersRange>;
