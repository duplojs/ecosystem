import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoDS, DStoTS } from "@scripts";

describe("taggedObjectStructureTransformer", () => {
	it("renders a tagged audit event payload", () => {
		const auditEvent = DModeling.TaggedObjectStructure("AuditEvent", {
			id: DModeling.NewTypeStructure("EventId", DDataStructure.string([DDataStructure.uuid()]), []),
			actorId: DDataStructure.string([DDataStructure.uuid()]),
			action: DDataStructure.literal(["product.created", "product.archived"]),
			rawPayload: DDataStructure.NonEncodableStringStructure("redacted-audit-payload"),
		}).addIdentifier("AuditEventStructure");

		expect(DStoDS.render(auditEvent, {
			identifier: "RenderedAuditEvent",
			structureTransformers: [
				DStoDS.newTypeStructureTransformer,
				DStoDS.nonEncodableStringStructureTransformer,
				DStoDS.taggedObjectStructureTransformer,
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

	it("propagates an unsupported tagged object property", () => {
		const event = DModeling.TaggedObjectStructure("Event", {
			id: DDataStructure.string(),
		});

		expect(() => DStoDS.render(event, {
			identifier: "TaggedEvent",
			structureTransformers: [DStoDS.taggedObjectStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toThrowErrorMatchingSnapshot();
	});
});
