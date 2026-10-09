import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const maxCharactersConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/max-characters-constraint", unknown>>;
export interface MaxCharactersConstraintDefinition<GenericMax extends number = number> extends ConstraintDefinition {
    readonly max: GenericMax;
}
export interface MaxCharactersConstraint<GenericMax extends number = number> extends DCommon.Forward<Constraint<string, string & DString.MaxCharacters<GenericMax>, MaxCharactersConstraintDefinition<GenericMax>> & DKind.Kind<typeof maxCharactersConstraintKind>> {
}
export declare const MaxCharactersConstraint: <GenericMax extends number>(max: GenericMax) => MaxCharactersConstraint<GenericMax>;
