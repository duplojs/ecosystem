import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import * as DStoTS from "@scripts/toTypescript";
import type { ConstraintTransformer, ConstraintTransformerParams } from "./create";
import type { ConstraintTransformerEither } from "../result";

export interface ConstraintTransformerFunctionParams {
	readonly transformers: readonly ConstraintTransformer[];
	readonly importContext: DStoTS.MapImportContext;
}

export function constraintTransformer(
	constraint: DDataStructure.Constraint,
	params: ConstraintTransformerFunctionParams,
): ConstraintTransformerEither {
	const transformerParams: ConstraintTransformerParams = {
		importContext: params.importContext,
		success: (value) => DEither.right("buildSuccess", value),
		buildError: () => DEither.left("buildConstraintError", constraint),
		addImport: DStoTS.createAddImport(params.importContext),
	};

	return constraint.definition.overrideConstraintTransformer
		? constraint.definition.overrideConstraintTransformer(
			constraint.addOverrideConstraintTransformer(null),
			transformerParams,
		)
		: DArray.reduce(
			params.transformers,
			DArray.reduceFrom<ConstraintTransformerEither>(DEither.left("constraintNotSupport", constraint)),
			({
				element: transformer,
				lastValue,
				next,
				exit,
			}) => {
				const result = transformer(constraint, transformerParams);

				if (DEither.isLeft(result)) {
					if (DEither.hasInformation(result, "buildConstraintError")) {
						return exit(result);
					}

					return next(lastValue);
				}

				return exit(result);
			},
		);
}
