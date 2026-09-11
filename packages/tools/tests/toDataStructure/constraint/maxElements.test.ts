import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("maxElementsConstraintTransformer", () => {
	it("renders a cart size upper bound", () => {
		const cart = DDataStructure.object({
			lines: DDataStructure.array(DDataStructure.string(), [DDataStructure.maxElements(50)]),
		});

		expect(DStoDS.render(cart, {
			identifier: "Cart",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.maxElementsConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
