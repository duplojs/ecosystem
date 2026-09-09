import { DCommon, DKind, type ExpectType } from "@scripts";

describe("common kind", () => {
	it("creates namespaced kind handlers", () => {
		const testKind = DCommon.createKind<"test-kind", string>("test-kind");
		const input = { id: 1 };
		const result = testKind.addTo(input, "value");

		type _CheckDefinition = ExpectType<
			typeof testKind.definition,
			DKind.Definition<"@DuplojsLangCommon/test-kind", string>,
			"strict"
		>;

		expect(testKind.runTimeKey).toBe(`${DKind.keyKindPrefix}@DuplojsLangCommon/test-kind`);
		expect(testKind.has(input)).toBe(false);
		expect(testKind.has(result)).toBe(true);
		expect(testKind.getValue(result)).toBe("value");
		expect(result).toStrictEqual({
			id: 1,
			[testKind.runTimeKey]: "value",
		});
	});
});
