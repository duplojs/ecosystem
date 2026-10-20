import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const startsWithConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/starts-with-constraint", unknown>>;
export interface StartsWithConstraintDefinition<GenericSearchString extends string = string> extends ConstraintDefinition {
    readonly searchString: GenericSearchString;
}
export interface StartsWithConstraint<GenericSearchString extends string = string> extends DCommon.Forward<Constraint<string, `${GenericSearchString}${string}`, StartsWithConstraintDefinition<GenericSearchString>> & DKind.Kind<typeof startsWithConstraintKind>> {
}
export declare const StartsWithConstraint: <GenericSearchString extends string>(searchString: GenericSearchString) => StartsWithConstraint<GenericSearchString>;
