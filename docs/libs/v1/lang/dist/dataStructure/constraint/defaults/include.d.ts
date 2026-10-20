import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const includeConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/include-constraint", unknown>>;
export interface IncludeConstraintDefinition<GenericSearchString extends string = string> extends ConstraintDefinition {
    readonly searchString: GenericSearchString;
}
export interface IncludeConstraint<GenericSearchString extends string = string> extends DCommon.Forward<Constraint<string, `${string}${GenericSearchString}${string}`, IncludeConstraintDefinition<GenericSearchString>> & DKind.Kind<typeof includeConstraintKind>> {
}
export declare const IncludeConstraint: <GenericSearchString extends string>(searchString: GenericSearchString) => IncludeConstraint<GenericSearchString>;
