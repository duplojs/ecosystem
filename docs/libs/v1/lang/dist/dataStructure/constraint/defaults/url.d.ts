import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const urlConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/url-constraint", unknown>>;
export interface UrlConstraintDefinition extends ConstraintDefinition {
}
export interface UrlConstraint extends DCommon.Forward<Constraint<string, string & DString.Url, UrlConstraintDefinition> & DKind.Kind<typeof urlConstraintKind>> {
}
export declare const UrlConstraint: () => UrlConstraint;
