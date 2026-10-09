import { MaxCharactersConstraint } from '../constraint';
export declare function maxCharacters<GenericMax extends number>(max: GenericMax): MaxCharactersConstraint<GenericMax>;
