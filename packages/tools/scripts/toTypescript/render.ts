import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DKind from "@duplojs/lang/kind";
import { buildContext, type BuildContextParams } from "./buildContext";
import { createKind } from "./kind";
import { printer } from "./printer";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither } from "./result";

export interface RenderParams extends BuildContextParams {}

export class DataStructureToTypescriptRenderError extends DKind.parentClass(
	createKind("data-structure-to-typescript-render-error"),
	Error,
) {
	public constructor(
		public structure: DDataStructure.Structure,
		public error:
			| DataStructureNotSupportedEither
			| DataStructureErrorEither
			| ConstraintNotSupportedEither
			| ConstraintErrorEither,
	) {
		super(
			undefined,
			"Error during the render of a data structure as a TypeScript type.",
		);
	}
}

export function render(
	structure: DDataStructure.Structure,
	params: RenderParams,
): string {
	const result = buildContext(
		structure,
		params,
	);

	if (DEither.isLeft(result)) {
		throw new DataStructureToTypescriptRenderError(
			structure,
			result,
		);
	}

	return printer(DEither.unwrapRight(result));
}
