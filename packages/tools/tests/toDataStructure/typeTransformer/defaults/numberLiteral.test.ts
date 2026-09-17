import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("numberLiteralTypeTransformer", () => {
	it("renders a number literal type", () => {
		expect(DStoDS.render(DDataStructure.literal(-12.5), {
			identifier: "NumberLiteralValue",
			typeTransformers: [DStoDS.numberLiteralTypeTransformer],
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
