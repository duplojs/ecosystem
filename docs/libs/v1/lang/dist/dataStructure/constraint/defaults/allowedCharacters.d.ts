import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const allowedCharactersConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/allowed-characters-constraint", unknown>>;
export interface AllowedCharactersConstraintDefinition<GenericCharactersRange extends DString.CharactersRange = DString.CharactersRange> extends ConstraintDefinition {
    readonly charactersRange: DCommon.MaybeArray<GenericCharactersRange>;
}
export interface AllowedCharactersConstraint<GenericCharactersRange extends DString.CharactersRange = DString.CharactersRange> extends DCommon.Forward<Constraint<string, string & DString.AllowedCharacters<GenericCharactersRange>, AllowedCharactersConstraintDefinition<GenericCharactersRange>> & DKind.Kind<typeof allowedCharactersConstraintKind>> {
}
export declare const AllowedCharactersConstraint: <GenericCharactersRange extends DString.CharactersRange>(charactersRange: DCommon.MaybeArray<GenericCharactersRange>) => AllowedCharactersConstraint<GenericCharactersRange>;
