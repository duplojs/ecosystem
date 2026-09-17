import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("defaultTypeTransformers", () => {
	it("contains every default type transformer in priority order", () => {
		expect(DStoDS.defaultTypeTransformers).toStrictEqual([
			DStoDS.bigintTypeTransformer,
			DStoDS.bigintLiteralTypeTransformer,
			DStoDS.booleanTypeTransformer,
			DStoDS.booleanLiteralTypeTransformer,
			DStoDS.dateTypeTransformer,
			DStoDS.fileTypeTransformer,
			DStoDS.nullTypeTransformer,
			DStoDS.numberTypeTransformer,
			DStoDS.numberLiteralTypeTransformer,
			DStoDS.stringTypeTransformer,
			DStoDS.stringLiteralTypeTransformer,
			DStoDS.timeTypeTransformer,
			DStoDS.undefinedTypeTransformer,
		]);
	});

	it("renders a type through the default transformer collection", () => {
		expect(DStoDS.render(DDataStructure.string(), {
			identifier: "DefaultString",
			typeTransformers: DStoDS.defaultTypeTransformers,
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
