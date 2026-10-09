import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const regexConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/regex-constraint", unknown>>;
export interface RegexConstraintDefinition extends ConstraintDefinition {
    readonly regex: RegExp;
}
export interface RegexConstraint extends DCommon.Forward<Constraint<string, string, RegexConstraintDefinition> & DKind.Kind<typeof regexConstraintKind>> {
}
export declare const RegexConstraint: (regex: RegExp) => RegexConstraint;
