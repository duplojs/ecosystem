import { Uuid } from './constraints';
export declare const uuidRegex: RegExp;
export declare function isUuid<GenericString extends string>(string: GenericString): string is GenericString & Uuid;
