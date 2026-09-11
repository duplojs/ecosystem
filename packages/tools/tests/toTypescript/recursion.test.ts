import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS, Typescript, getRecursiveDataStructure } from "@scripts";

describe("toTypescript recursion", () => {
	it("renders a nested recursive structure with an automatic identifier", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.number(),
			DDataStructure.array(
				DDataStructure.lazy(() => recursiveStructure),
			),
		]);

		expect(DStoTS.render(
			DDataStructure.array(recursiveStructure),
			{
				identifier: "Values",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("renders mutually recursive structures", () => {
		const structureStore: Partial<Record<"first" | "second", DDataStructure.Structure>> = {};
		const firstStructure = DDataStructure.object({
			name: DDataStructure.string(),
			next: DDataStructure.lazy(() => structureStore.second!),
		});
		const secondStructure = DDataStructure.object({
			value: DDataStructure.number(),
			next: DDataStructure.lazy(() => structureStore.first!),
		});

		structureStore.first = firstStructure;
		structureStore.second = secondStructure;

		expect(DStoTS.render(
			DDataStructure.array(firstStructure),
			{
				identifier: "Values",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("propagates undefined through a recursive union", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.undefined(),
			DDataStructure.array(DDataStructure.lazy(() => recursiveStructure)),
		]);

		expect(DStoTS.render(
			DDataStructure.object({ value: recursiveStructure }),
			{
				identifier: "Container",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("detects self recursion across lazy arrays and unions", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.number(),
			DDataStructure.array(DDataStructure.lazy(() => recursiveStructure)),
		]);

		expect(getRecursiveDataStructure(recursiveStructure)).toEqual([recursiveStructure]);
	});

	it("detects mutual recursion across object graphs and wrappers", () => {
		const structureStore: Partial<Record<"first" | "second", DDataStructure.Structure>> = {};
		const firstStructure = DModeling.EntityStructure("User", () => ({
			name: DDataStructure.string(),
			next: DDataStructure.lazy(() => structureStore.second!),
		}));
		const secondStructure = DModeling.TaggedObjectStructure("UserNode", {
			value: DDataStructure.number(),
			next: DDataStructure.lazy(() => structureStore.first!),
		});

		structureStore.first = firstStructure;
		structureStore.second = secondStructure;

		expect(getRecursiveDataStructure(firstStructure)).toHaveLength(1);
		expect(getRecursiveDataStructure(firstStructure)[0]).toBe(firstStructure.definition.inner.value);
	});

	it("detects wrapper-based self recursion for tagged objects and new types", () => {
		let selfNewType: DDataStructure.Structure | undefined = undefined;
		selfNewType = DModeling.NewTypeStructure("Node", DDataStructure.lazy(() => selfNewType!), []);

		const selfTaggedObject: DDataStructure.Structure = DModeling.TaggedObjectStructure("Node", {
			next: DDataStructure.lazy(() => selfTaggedObject),
		});

		expect(getRecursiveDataStructure(selfNewType)).toHaveLength(1);
		expect(getRecursiveDataStructure(selfTaggedObject)).toHaveLength(1);
	});

	it("renders a self-recursive array tree without throwing", () => {
		const tree: DDataStructure.Structure = DDataStructure.array(
			DDataStructure.lazy(() => tree),
		);

		expect(() => DStoTS.render(
			DDataStructure.object({ tree }),
			{
				identifier: "TreeRoot",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).not.toThrow();
	});

	it("renders a multi-level recursive object graph through render", () => {
		const structureStore: Partial<Record<"root" | "node", DDataStructure.Structure>> = {};
		const node = DModeling.TaggedObjectStructure("Node", {
			value: DDataStructure.number(),
			next: DDataStructure.lazy(() => structureStore.root!),
		});
		const root = DDataStructure.object({
			name: DDataStructure.string(),
			children: DDataStructure.array(DDataStructure.lazy(() => structureStore.node!)),
		});

		structureStore.root = root;
		structureStore.node = node;

		expect(() => DStoTS.render(
			DDataStructure.object({ tree: root }),
			{
				identifier: "TreeContainer",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).not.toThrow();
	});

	it("cleans up non recursive unions and handles unsupported structure kinds", () => {
		const simpleUnion = DDataStructure.union([
			DDataStructure.number(),
			DDataStructure.string(),
		]);
		const unsupportedStructure = {
			[DDataStructure.structureKind.runTimeKey]: null,
			definition: { inner: DDataStructure.string() },
		} as unknown as DDataStructure.Structure;

		const finalFallbackStructure = {
			[DDataStructure.structureKind.runTimeKey]: null,
		} as unknown as DDataStructure.Structure;

		expect(getRecursiveDataStructure(simpleUnion)).toEqual([]);
		expect(getRecursiveDataStructure(unsupportedStructure)).toEqual([]);
		expect(getRecursiveDataStructure(finalFallbackStructure)).toEqual([]);
	});

	it("falls back on generic structure-shaped objects without recursion", () => {
		const genericStructure = {
			[DDataStructure.structureKind.runTimeKey]: null,
			definition: {
				inner: DDataStructure.string(),
			},
		} as unknown as DDataStructure.Structure;

		expect(getRecursiveDataStructure(genericStructure)).toEqual([]);
	});

	it("ignores non recursive values and leaves records untouched", () => {
		expect(getRecursiveDataStructure(DDataStructure.object({
			id: DDataStructure.number(),
			meta: DDataStructure.record(
				DDataStructure.literal("key"),
				DDataStructure.string(),
			),
		}))).toEqual([]);
	});

	it("creates identifiers that sanitize invalid characters", () => {
		expect(DStoTS.createIdentifier("  user-name!  ")).toBe("UserName");
		expect(DStoTS.createIdentifier(" 1value-name ")).toBe("_1valueName");
		expect(DStoTS.createIdentifier("!!!")).toBe("Type");
	});

	it("detects undefined inside unions and interface members", () => {
		const valueType = Typescript.factory.createUnionTypeNode([
			Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
			Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.UndefinedKeyword),
		]);
		const declaration = Typescript.factory.createInterfaceDeclaration(
			[],
			"Example",
			undefined,
			[],
			[
				Typescript.factory.createPropertySignature(
					undefined,
					"value",
					undefined,
					valueType,
				),
			],
		);

		expect(DStoTS.includesUndefinedTypeNode(valueType)).toBe(true);
		expect(DStoTS.contextDeclarationIncludesUndefined(declaration)).toBe(true);
		expect(DStoTS.includesUndefinedTypeNode(
			Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.NumberKeyword),
		)).toBe(false);
	});
});
