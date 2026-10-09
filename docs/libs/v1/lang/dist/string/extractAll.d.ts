import { ExtractOutput } from './extract';
export declare function extractAll<GenericString extends string>(pattern: RegExp): (string: GenericString) => Generator<ExtractOutput<GenericString>>;
export declare function extractAll<GenericString extends string>(string: GenericString, pattern: RegExp): Generator<ExtractOutput<GenericString>>;
