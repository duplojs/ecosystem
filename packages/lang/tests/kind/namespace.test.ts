import { DKind, type ExpectType } from "@scripts";

describe("createNamespace", () => {
	it("creates handlers with namespaced runtime keys", () => {
		const createKind = DKind.createNamespace("TestNamespace");
		const kind = createKind<"item", number>("item");
		const result = kind.addTo({}, 42);

		type _CheckDefinition = ExpectType<
			typeof kind.definition,
			DKind.Definition<"@TestNamespace/item", number>,
			"strict"
		>;

		expect(kind.runTimeKey).toBe(`${DKind.keyKindPrefix}@TestNamespace/item`);
		expect(kind.has(result)).toBe(true);
		expect(kind.getValue(result)).toBe(42);
	});

	it("rejects forbidden namespace and kind names at type level", () => {
		// @ts-expect-error namespaces cannot contain @.
		DKind.createNamespace("bad@namespace");
		// @ts-expect-error namespaces cannot contain /.
		DKind.createNamespace("bad/namespace");

		const createKind = DKind.createNamespace("ValidNamespace");

		// @ts-expect-error namespaced kind names cannot contain @.
		createKind("bad@kind");
		// @ts-expect-error namespaced kind names cannot contain /.
		createKind("bad/kind");
	});
});
