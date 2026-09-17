import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DStoTS from "@scripts/toTypescript";
import type { DataStructureTypeTransformerEither } from "../result";
import type { TypeTransformer, TypeTransformerParams } from "./create";

export interface TypeTransformerFunctionParams {
	readonly transformers: readonly TypeTransformer[];
	readonly importContext: DStoTS.MapImportContext;
}

export function typeTransformer(
	type: DDataStructure.Type,
	params: TypeTransformerFunctionParams,
): DataStructureTypeTransformerEither {
	const transformerParams: TypeTransformerParams = {
		importContext: params.importContext,
		success: (result) => DEither.right("buildSuccess", result),
		buildError: () => DEither.left("buildDataStructureTypeError", type),
		addImport: DStoTS.createAddImport(params.importContext),
	};

	return DArray.reduce(
		params.transformers,
		DArray.reduceFrom<DataStructureTypeTransformerEither>(DEither.left("dataStructureTypeNotSupport", type)),
		({
			element: currentTransformer,
			lastValue,
			next,
			exit,
		}) => {
			const result = currentTransformer(
				type,
				transformerParams,
			);

			if (DEither.isLeft(result)) {
				if (DEither.hasInformation(result, "buildDataStructureTypeError")) {
					return exit(result);
				}

				return next(lastValue);
			}

			return exit(result);
		},
	);
}
