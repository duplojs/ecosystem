import * as DKind from "@duplojs/lang/kind";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { createKind } from "./kind";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither } from "./result";
import { buildContext, type BuildContextParams } from "./buildContext";
import { printer } from "./printer";

export class DataStructureToDataStructureRenderError extends DKind.parentClass(
	createKind("data-structure-to-data-structure-render-error"),
	Error,
) {
	public constructor(
		public structure: DDataStructure.Structure,
		public error: (
			| DataStructureNotSupportedEither
			| DataStructureErrorEither
			| ConstraintNotSupportedEither
			| ConstraintErrorEither
		),
	) {
		super(undefined, "Error during the render of dataStructure in dataStructure.");
	}
}

export interface RenderParams extends BuildContextParams { }

export function render(
	structure: DDataStructure.Structure,
	params: RenderParams,
) {
	const result = buildContext(structure, params);

	if (
		DEither.hasInformation(result, [
			"buildConstraintError",
			"buildDataStructureError",
			"constraintNotSupport",
			"dataStructureNotSupport",
		])
	) {
		throw new DataStructureToDataStructureRenderError(
			structure,
			result,
		);
	}

	return printer(
		DEither.unwrapRight(result),
	);
}
