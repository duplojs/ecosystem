import { Email } from './constraints';
export declare const emailRegex: RegExp;
export declare function isEmail<GenericString extends string>(string: GenericString): string is GenericString & Email;
