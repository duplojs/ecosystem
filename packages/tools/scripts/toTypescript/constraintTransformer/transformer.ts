import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { createAddImport, type MapImportContext } from "../importContext";
import type { ConstraintTransformer, ConstraintTransformerParams } from "./create";
import type { ConstraintTransformerEither } from "../result";

export interface ConstraintTransformerFunctionParams {
	readonly transformers: readonly ConstraintTransformer[];
	readonly importContext: MapImportContext;
}

export function constraintTransformer(
	constraint: DDataStructure.Constraint,
	params: ConstraintTransformerFunctionParams,
): ConstraintTransformerEither {
	const transformerParams: ConstraintTransformerParams = {
		importContext: params.importContext,
		success: (typeNode) => DEither.right("buildSuccess", typeNode),
		buildError: () => DEither.left("buildConstraintError", constraint),
		addImport: createAddImport(params.importContext),
	};

	for (const currentTransformer of params.transformers) {
		const result = currentTransformer(
			constraint,
			transformerParams,
		);

		if (!DEither.isLeft(result)) {
			return result;
		}

		if (DEither.hasInformation(result, "buildConstraintError")) {
			return result;
		}
	}

	return DEither.left("constraintNotSupport", constraint);
}
