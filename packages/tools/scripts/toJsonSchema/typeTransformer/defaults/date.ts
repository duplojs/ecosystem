import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";

export const dateTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.dateTypeKind),
	(
		_type,
		_constraints,
		{ success },
	) => success({
		anyOf: [
			{
				type: "string",
				pattern: DChrono.serializeTheDateRegex.source.replaceAll(/\(\?<[^>]+>/g, "("),
			},
			{
				type: "string",
				format: "date-time",
			},
		],
	}),
);
