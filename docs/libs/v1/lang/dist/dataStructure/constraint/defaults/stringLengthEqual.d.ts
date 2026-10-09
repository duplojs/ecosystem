import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const stringLengthEqualConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/string-length-equal-constraint", unknown>>;
export interface StringLengthEqualConstraintDefinition<GenericLength extends number = number> extends ConstraintDefinition {
    readonly length: GenericLength;
}
export interface StringLengthEqualConstraint<GenericLength extends number = number> extends DCommon.Forward<Constraint<string, string & DString.LengthEqual<GenericLength>, StringLengthEqualConstraintDefinition<GenericLength>> & DKind.Kind<typeof stringLengthEqualConstraintKind>> {
}
export declare const StringLengthEqualConstraint: <GenericLength extends number>(length: GenericLength) => StringLengthEqualConstraint<GenericLength>;
