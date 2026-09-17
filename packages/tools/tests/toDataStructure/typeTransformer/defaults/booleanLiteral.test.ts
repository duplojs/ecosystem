import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("booleanLiteralTypeTransformer", () => {
	it("renders a boolean literal type", () => {
		expect(DStoDS.render(DDataStructure.literal(false), {
			identifier: "BooleanLiteralValue",
			typeTransformers: [DStoDS.booleanLiteralTypeTransformer],
			structureTransformers: [DStoDS.typeStructureTransformer],
			constraintTransformers: [],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
