import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const refineConstraintKind = createKind("refine-constraint");

export interface RefineConstraintDefinition<
	GenericInput extends unknown = unknown,
> extends ConstraintDefinition {
	refine(data: GenericInput): boolean;
}

export interface RefineConstraint<
	GenericInput extends unknown = unknown,
	GenericPredicate extends GenericInput = GenericInput,
> extends DCommon.Forward<
		& Constraint<
			GenericInput,
			GenericPredicate,
			RefineConstraintDefinition<GenericInput>
		>
		& DKind.Kind<typeof refineConstraintKind>
	> {

}

export const RefineConstraint = createConstraint(
	refineConstraintKind,
	({ init }) => <
		GenericInput extends unknown,
		GenericPredicate extends GenericInput = GenericInput,
	>(
		refine: (
			| ((data: GenericInput) => data is GenericPredicate)
			| ((data: GenericInput) => boolean)
		),
	) => init<
		RefineConstraint<
			GenericInput,
			GenericPredicate
		>
	>(
		{ refine },
		{
			executeCheck: (self, data) => self.definition.refine(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);
