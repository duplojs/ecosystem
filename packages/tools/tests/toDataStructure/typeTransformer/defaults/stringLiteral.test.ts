import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("stringLiteralTypeTransformer", () => {
	it("renders a string literal type", () => {
		expect(DStoDS.render(DDataStructure.literal("active"), {
			identifier: "StringLiteralValue",
			typeTransformers: [DStoDS.stringLiteralTypeTransformer],
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
