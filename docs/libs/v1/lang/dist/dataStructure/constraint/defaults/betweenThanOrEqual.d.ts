import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const betweenThanOrEqualConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/between-than-or-equal-constraint", unknown>>;
export interface BetweenThanOrEqualConstraintDefinition<GenericGreater extends number = number, GenericLess extends number = number> extends ConstraintDefinition {
    readonly greater: GenericGreater;
    readonly less: GenericLess;
}
export interface BetweenThanOrEqualConstraint<GenericGreater extends number = number, GenericLess extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.GreaterThanOrEqual<GenericGreater> & DNumber.LessThanOrEqual<GenericLess>, BetweenThanOrEqualConstraintDefinition<GenericGreater, GenericLess>> & DKind.Kind<typeof betweenThanOrEqualConstraintKind>> {
}
export declare const BetweenThanOrEqualConstraint: <GenericGreater extends number, GenericLess extends number>(greater: GenericGreater, less: GenericLess) => BetweenThanOrEqualConstraint<GenericGreater, GenericLess>;
