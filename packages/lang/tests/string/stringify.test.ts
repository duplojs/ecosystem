import { DString, type ExpectType } from "@scripts";

describe("stringify", () => {
	it("stringifies JSON values", () => {
		const result = DString.stringify({
			name: "duplo",
		});

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("{\"name\":\"duplo\"}");
	});

	it("falls back to String when JSON stringify has no string result", () => {
		const result = DString.stringify(undefined);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("undefined");
	});

	it("falls back to String when JSON stringify throws", () => {
		const bigintResult = DString.stringify(12n);
		const circular = {} as {
			self?: unknown;
			toString(): string;
		};
		circular.self = circular;
		circular.toString = () => "[Circular]";
		const circularResult = DString.stringify(circular);

		expect(bigintResult).toBe("12");
		expect(circularResult).toBe("[Circular]");
	});
});
