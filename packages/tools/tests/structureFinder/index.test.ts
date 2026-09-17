import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { StructureFinder } from "@scripts";

describe("structureFinder", () => {
	it("returns narrowed structures when the predicate is a type guard", () => {
		const root = DDataStructure.object({
			value: DDataStructure.string(),
		});

		const result = StructureFinder.structureFinder(
			root,
			DDataStructure.structureIdentifier(DDataStructure.typeStructureKind),
			{
				researchers: [StructureFinder.objectStructureResearcher],
				continueAfterMatch: true,
			},
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly DDataStructure.TypeStructure[],
			"strict"
		>;

		expect(result).toStrictEqual([root.definition.shape.value]);
	});

	it("returns structures when the predicate is boolean", () => {
		const root = DDataStructure.object({
			value: DDataStructure.string().addIdentifier("Value"),
		});

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.objectStructureResearcher],
				continueAfterMatch: true,
			},
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			readonly DDataStructure.Structure[],
			"strict"
		>;

		expect(result).toStrictEqual([root.definition.shape.value]);
	});

	it("stops on a matching structure by default", () => {
		const child = DDataStructure.string().addIdentifier("Child");
		const root = DDataStructure.object({
			child,
		}).addIdentifier("Root");

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{ researchers: [StructureFinder.objectStructureResearcher] },
		);

		expect(result).toStrictEqual([root]);
	});

	it("honors pre-filled ignored structures, including the root", () => {
		const root = DDataStructure.string().addIdentifier("Root");

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.objectStructureResearcher],
				ignore: new Set([root]),
			},
		);

		expect(result).toStrictEqual([]);
	});

	it("reuses the ignore context when the same structure is reached twice", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DDataStructure.object({
			first: target,
			second: target,
		});

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.objectStructureResearcher],
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
	});

	it("mutates the provided ignore context with every visited structure", () => {
		const target = DDataStructure.string().addIdentifier("Target");
		const root = DDataStructure.object({
			target,
		});
		const ignore = new Set<DDataStructure.Structure>();

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: [StructureFinder.objectStructureResearcher],
				ignore,
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([target]);
		expect(ignore).toStrictEqual(new Set([
			root,
			target,
		]));
	});
});

describe("defaultResearchers", () => {
	it("exposes every default researcher in traversal order", () => {
		expect(StructureFinder.defaultResearchers).toStrictEqual([
			StructureFinder.arrayStructureResearcher,
			StructureFinder.entityStructureResearcher,
			StructureFinder.lazyStructureResearcher,
			StructureFinder.newTypeStructureResearcher,
			StructureFinder.objectStructureResearcher,
			StructureFinder.recordStructureResearcher,
			StructureFinder.taggedObjectStructureResearcher,
			StructureFinder.unionStructureResearcher,
		]);
	});

	it("finds deeply through mixed structures with the default researchers", () => {
		const leaf = DDataStructure.string().addIdentifier("Leaf");
		const target = DModeling.createNewType("Target", leaf).addIdentifier("Target");
		const root = DModeling.EntityStructure(
			"Root",
			() => ({
				payload: DDataStructure.array(
					DDataStructure.lazy(
						() => DDataStructure.union([
							DDataStructure.number(),
							target,
						]),
					),
				),
			}),
		);

		const result = StructureFinder.structureFinder(
			root,
			(value) => !!value.definition.identifier,
			{
				researchers: StructureFinder.defaultResearchers,
				continueAfterMatch: true,
			},
		);

		expect(result).toStrictEqual([
			target,
			leaf,
		]);
	});
});
