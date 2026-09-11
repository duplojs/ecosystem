import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("greaterThanConstraintTransformer", () => {
	it("renders a positive order quantity", () => {
		const orderLine = DDataStructure.object({
			quantity: DDataStructure.number([DDataStructure.greaterThan(0)]),
		});

		expect(DStoDS.render(orderLine, {
			identifier: "OrderLine",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: [DStoDS.greaterThanConstraintTransformer],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});
});
