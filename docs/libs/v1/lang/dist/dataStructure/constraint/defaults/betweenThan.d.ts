import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const betweenThanConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/between-than-constraint", unknown>>;
export interface BetweenThanConstraintDefinition<GenericGreater extends number = number, GenericLess extends number = number> extends ConstraintDefinition {
    readonly greater: GenericGreater;
    readonly less: GenericLess;
}
export interface BetweenThanConstraint<GenericGreater extends number = number, GenericLess extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.GreaterThan<GenericGreater> & DNumber.LessThan<GenericLess>, BetweenThanConstraintDefinition<GenericGreater, GenericLess>> & DKind.Kind<typeof betweenThanConstraintKind>> {
}
export declare const BetweenThanConstraint: <GenericGreater extends number, GenericLess extends number>(greater: GenericGreater, less: GenericLess) => BetweenThanConstraint<GenericGreater, GenericLess>;
