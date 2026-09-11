import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("allowedCharactersConstraintTransformer", () => {
	it("renders one or several allowed character ranges", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.string([DDataStructure.allowedCharacters("a-z")]), params),
			DStoTS.render(DDataStructure.string([DDataStructure.allowedCharacters(["a-z", "0-9"])]), params),
		]).toMatchSnapshot();
	});

	it("rejects an empty character range collection", () => {
		expect(() => DStoTS.render(
			DDataStructure.string([DDataStructure.allowedCharacters([])]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
