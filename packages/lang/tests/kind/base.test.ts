import { DKind, type ExpectType } from "@scripts";

describe("kind create", () => {
	it("creates a kind handler that adds and reads kind values immutably", () => {
		const kind = DKind.create<"test", "value">("test");
		const input = { id: 1 };
		const result = kind.addTo(input, "value");

		type _CheckDefinition = ExpectType<
			typeof kind.definition,
			DKind.Definition<"test", "value">,
			"strict"
		>;
		type _CheckResult = ExpectType<
			typeof result,
			& DKind.Kind<typeof kind, "value">
			& { id: number },
			"strict"
		>;

		expect(kind.definition.name).toBe("test");
		expect(kind.runTimeKey).toBe(`${DKind.keyKindPrefix}test`);
		expect(kind.has(input)).toBe(false);
		expect(kind.has(result)).toBe(true);
		expect(kind.getValue(result)).toBe("value");
		expect(input).toStrictEqual({ id: 1 });
		expect(result).toStrictEqual({
			id: 1,
			[kind.runTimeKey]: "value",
		});
	});

	it("sets kind values by mutating the input", () => {
		const kind = DKind.create<"mutable", number>("mutable");
		const input = { id: 1 };
		const result = kind.setTo(input, 12);

		expect(result).toBe(input);
		expect(kind.has(input)).toBe(true);
		expect(kind.getValue(result)).toBe(12);
	});

	it("detects runtime keys", () => {
		const kind = DKind.create("runtime");

		expect(DKind.isRuntimeKey(kind.runTimeKey)).toBe(true);
		expect(DKind.isRuntimeKey("runtime")).toBe(false);
		expect(kind.has(null)).toBe(false);
		expect(kind.has("value")).toBe(false);
	});

	it("rejects forbidden kind names at type level", () => {
		// @ts-expect-error kind names cannot contain @.
		DKind.create("with@at");
		// @ts-expect-error kind names cannot contain /.
		DKind.create("with/slash");
	});
});
