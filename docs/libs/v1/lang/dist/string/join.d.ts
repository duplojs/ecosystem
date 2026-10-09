import { Join } from './types';
export declare function join<GenericStrings extends readonly string[], GenericSeparator extends string>(separator: GenericSeparator): (strings: GenericStrings) => Join<GenericStrings, GenericSeparator>;
export declare function join<GenericStrings extends readonly string[], GenericSeparator extends string>(strings: GenericStrings, separator: GenericSeparator): Join<GenericStrings, GenericSeparator>;
