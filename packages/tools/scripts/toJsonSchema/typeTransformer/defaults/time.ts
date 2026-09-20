import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";

export const timeTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.timeTypeKind),
	(
		_type,
		_constraints,
		{ success },
	) => success({
		anyOf: [
			{
				type: "string",
				pattern: DChrono.serializeTheTimeRegex.source.replaceAll(/\(\?<[^>]+>/g, "("),
			},
			{
				type: "string",
				format: "time",
			},
		],
	}),
);
