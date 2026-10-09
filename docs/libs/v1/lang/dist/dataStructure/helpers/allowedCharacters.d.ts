import { AllowedCharactersConstraint } from '../constraint';
import type * as DCommon from '../../common';
import type * as DString from '../../string';
export declare function allowedCharacters<GenericCharactersRange extends DString.CharactersRange>(charactersRange: DCommon.MaybeArray<GenericCharactersRange>): AllowedCharactersConstraint<GenericCharactersRange>;
