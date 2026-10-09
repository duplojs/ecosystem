import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const minCharactersConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/min-characters-constraint", unknown>>;
export interface StringMinConstraintDefinition<GenericMin extends number = number> extends ConstraintDefinition {
    readonly min: GenericMin;
}
export interface MinCharactersConstraint<GenericMin extends number = number> extends DCommon.Forward<Constraint<string, string & DString.MinCharacters<GenericMin>, StringMinConstraintDefinition<GenericMin>> & DKind.Kind<typeof minCharactersConstraintKind>> {
}
export declare const MinCharactersConstraint: <GenericMin extends number>(min: GenericMin) => MinCharactersConstraint<GenericMin>;
