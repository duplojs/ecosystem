import { DString, type ExpectType } from "@scripts";

describe("to", () => {
	it("should convert primitives to string", () => {
		expect(DString.to("hello")).toBe("hello");
		expect(DString.to(42)).toBe("42");
		expect(DString.to(true)).toBe("true");
		expect(DString.to(null)).toBe("null");
		expect(DString.to(undefined)).toBe("undefined");
		expect(DString.to(42n)).toBe("42");
	});

	it("should preserve primitive literal string output", () => {
		const result = DString.to(42);

		type _CheckResult = ExpectType<
			typeof result,
			"42",
			"strict"
		>;
	});
});
