import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type * as DStoTS from "@scripts/toTypescript";
import type { ConstraintErrorEither, ConstraintTransformerEither, TransformerSuccessEither } from "../result";

export interface ConstraintTransformerParams {
	readonly importContext: DStoTS.MapImportContext;

	success(result: Typescript.CallExpression | Typescript.Identifier): TransformerSuccessEither;

	buildError(): ConstraintErrorEither;

	addImport(path: string, typeName: string, type?: DStoTS.ImportKind): void;
}

export type ConstraintTransformerBuildFunction<
	GenericConstraint extends DDataStructure.Constraint = DDataStructure.Constraint,
> = (
	constraint: GenericConstraint,
	params: ConstraintTransformerParams,
) => ConstraintTransformerEither;

export type ConstraintTransformer = (
	constraint: DDataStructure.Constraint,
	params: ConstraintTransformerParams,
) => ConstraintTransformerEither;

export function createConstraintTransformer<
	GenericConstraint extends DDataStructure.Constraint,
>(
	support: (
		constraint: DDataStructure.Constraint,
	) => constraint is GenericConstraint,
	builder: ConstraintTransformerBuildFunction<GenericConstraint>,
): ConstraintTransformer {
	return (
		constraint,
		params,
	) => support(constraint)
		? builder(
			constraint,
			params,
		)
		: DEither.left("constraintNotSupport", constraint);
}
