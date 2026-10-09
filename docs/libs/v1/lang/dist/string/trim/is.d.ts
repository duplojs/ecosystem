import { Trimmed } from '../constraints';
export declare function isTrimmed<GenericString extends string>(input: GenericString): input is GenericString & Trimmed;
