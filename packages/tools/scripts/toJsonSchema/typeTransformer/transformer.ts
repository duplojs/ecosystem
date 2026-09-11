import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { TypeTransformer, TypeTransformerParams } from "./create";
import type { DataStructureTypeTransformerEither } from "../result";

export interface TypeTransformerFunctionParams {
	readonly transformers: readonly TypeTransformer[];
	readonly transformerParams: TypeTransformerParams;
}

export function typeTransformer(
	type: DDataStructure.Type,
	constraints: readonly DDataStructure.Constraint[],
	params: TypeTransformerFunctionParams,
): DataStructureTypeTransformerEither {
	for (const currentTransformer of params.transformers) {
		const result = currentTransformer(
			type,
			constraints,
			params.transformerParams,
		);

		if (
			DEither.isLeft(result)
			&& DEither.hasInformation(result, "dataStructureTypeNotSupport")
		) {
			continue;
		}

		return result;
	}

	return DEither.left("dataStructureTypeNotSupport", type);
}
