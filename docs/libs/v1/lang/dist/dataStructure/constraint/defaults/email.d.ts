import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const emailConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/email-constraint", unknown>>;
export interface EmailConstraintDefinition extends ConstraintDefinition {
}
export interface EmailConstraint extends DCommon.Forward<Constraint<string, string & DString.Email, EmailConstraintDefinition> & DKind.Kind<typeof emailConstraintKind>> {
}
export declare const EmailConstraint: () => EmailConstraint;
