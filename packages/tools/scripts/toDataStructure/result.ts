import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";

export type TransformerSuccessEither = DEither.Right<
	"buildSuccess",
	Typescript.CallExpression | Typescript.Identifier
>;

export type ConstraintNotSupportedEither = DEither.Left<
	"constraintNotSupport",
	DDataStructure.Constraint
>;

export type ConstraintErrorEither = DEither.Left<
	"buildConstraintError",
	DDataStructure.Constraint
>;

export type ConstraintTransformerEither = (
	| TransformerSuccessEither
	| ConstraintNotSupportedEither
	| ConstraintErrorEither
);

export type DataStructureNotSupportedEither = DEither.Left<
	"dataStructureNotSupport",
	DDataStructure.Structure
>;

export type DataStructureErrorEither = DEither.Left<
	"buildDataStructureError",
	DDataStructure.Structure
>;

export type TransformerEither = (
	| TransformerSuccessEither
	| DataStructureNotSupportedEither
	| DataStructureErrorEither
	| ConstraintTransformerEither
);
