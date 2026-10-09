import { NormalizeForm } from './types';
export declare function normalize<GenericString extends string>(form: NormalizeForm): (string: GenericString) => string;
export declare function normalize<GenericString extends string>(string: GenericString, form: NormalizeForm): string;
