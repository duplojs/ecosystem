import { StringReplacer } from './replace';
export declare function replaceAll<GenericString extends string>(pattern: string | RegExp, replacement: string | StringReplacer<GenericString>): (string: GenericString) => string;
export declare function replaceAll<GenericString extends string>(string: GenericString, pattern: string | RegExp, replacement: string | StringReplacer<GenericString>): string;
