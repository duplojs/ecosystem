import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoDS, DStoTS } from "@scripts";

describe("entityStructureTransformer", () => {
	it("renders an order entity with customer and status fields", () => {
		const customerId = DModeling.NewTypeStructure(
			"CustomerId",
			DDataStructure.string([DDataStructure.uuid()]),
			[],
		).addIdentifier("CustomerIdStructure");
		const order = DModeling.EntityStructure("Order", () => ({
			id: DModeling.NewTypeStructure("OrderId", DDataStructure.string([DDataStructure.uuid()]), []),
			customerId,
			status: DDataStructure.literal(["draft", "paid", "cancelled"]),
			invoice: DDataStructure.optional(DDataStructure.object({
				number: DDataStructure.string([DDataStructure.notEmpty()]),
			})),
		})).addIdentifier("OrderEntity");

		expect(DStoDS.render(order, {
			identifier: "RenderedOrderEntity",
			structureTransformers: [
				DStoDS.entityStructureTransformer,
				DStoDS.newTypeStructureTransformer,
				DStoDS.nonEncodableStringStructureTransformer,
				DStoDS.objectStructureTransformer,
				DStoDS.typeStructureTransformer,
				DStoDS.unionStructureTransformer,
			],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("propagates an unsupported entity property", () => {
		const user = DModeling.EntityStructure("User", () => ({
			email: DDataStructure.string(),
		}));

		expect(() => DStoDS.render(user, {
			identifier: "UserEntity",
			structureTransformers: [DStoDS.entityStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toThrowErrorMatchingSnapshot();
	});
});
