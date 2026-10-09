import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DArray from '../../../array';
export declare const arrayLengthEqualConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/array-length-equal-constraint", unknown>>;
export interface ArrayLengthEqualConstraintDefinition<GenericLength extends number = number> extends ConstraintDefinition {
    readonly length: GenericLength;
}
export interface ArrayLengthEqualConstraint<GenericLength extends number = number> extends DCommon.Forward<Constraint<readonly unknown[], readonly unknown[] & DArray.LengthEqual<GenericLength>, ArrayLengthEqualConstraintDefinition<GenericLength>> & DKind.Kind<typeof arrayLengthEqualConstraintKind>> {
}
export declare const ArrayLengthEqualConstraint: <GenericLength extends number>(length: GenericLength) => ArrayLengthEqualConstraint<GenericLength>;
