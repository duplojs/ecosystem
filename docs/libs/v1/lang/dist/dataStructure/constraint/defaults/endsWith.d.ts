import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const endsWithConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/ends-with-constraint", unknown>>;
export interface EndsWithConstraintDefinition<GenericSearchString extends string = string> extends ConstraintDefinition {
    readonly searchString: GenericSearchString;
}
export interface EndsWithConstraint<GenericSearchString extends string = string> extends DCommon.Forward<Constraint<string, `${string}${GenericSearchString}`, EndsWithConstraintDefinition<GenericSearchString>> & DKind.Kind<typeof endsWithConstraintKind>> {
}
export declare const EndsWithConstraint: <GenericSearchString extends string>(searchString: GenericSearchString) => EndsWithConstraint<GenericSearchString>;
