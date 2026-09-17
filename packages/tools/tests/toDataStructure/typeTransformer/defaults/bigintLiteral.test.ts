import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("bigintLiteralTypeTransformer", () => {
	it("renders a bigint literal type", () => {
		expect(DStoDS.render(DDataStructure.literal(-12n), {
			identifier: "BigintLiteralValue",
			typeTransformers: [DStoDS.bigintLiteralTypeTransformer],
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
