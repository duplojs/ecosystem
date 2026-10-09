import { Right } from './right';
import { Left } from './left';
type Either = Right | Left;
export declare function expect<GenericEither extends Either>(input: GenericEither): GenericEither;
export {};
