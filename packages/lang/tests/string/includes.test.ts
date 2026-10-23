import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("includes", () => {
	it("should validate contained text", () => {
		expect(DString.includes("hello world", "world")).toBe(true);
		expect(DString.includes("hello world", "duplo")).toBe(false);
	});

	it("should narrow contained text inside a pipe when callback", () => {
		const source = "hello world" as "hello world" | "admin";
		const result = DCommon.pipe(
			source,
			DCommon.when(
				DString.includes("world"),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						"hello world",
						"strict"
					>;

					return value.toUpperCase();
				},
			),
		);

		expect(result).toBe("HELLO WORLD");
	});

	it("should narrow a string union to values containing the search string", () => {
		const source = "api-user" as "api-user" | "admin";

		if (DString.includes(source, "api")) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				"api-user",
				"strict"
			>;
		} else {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				"admin",
				"strict"
			>;
		}
	});
});
