import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("minCharactersConstraintTransformer", () => {
	it("renders positive and negative minimums", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.string([DDataStructure.minCharacters(2)]), params),
			DStoTS.render(DDataStructure.string([DDataStructure.minCharacters(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite minimum", () => {
		expect(() => DStoTS.render(
			DDataStructure.string([DDataStructure.minCharacters(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
