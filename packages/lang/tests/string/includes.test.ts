import { DString, pipe, when, type ExpectType } from "@scripts";

describe("includes", () => {
	it("should validate contained text", () => {
		expect(DString.includes("hello world", "world")).toBe(true);
		expect(DString.includes("hello world", "duplo")).toBe(false);
	});

	it("should narrow contained text inside a pipe when callback", () => {
		const source = "hello world" as "hello world" | "admin";
		const result = pipe(
			source,
			when(
				DString.includes("world"),
				(value) => {
					type _CheckValue = ExpectType<
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
			type _CheckSource = ExpectType<
				typeof source,
				"api-user",
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				"admin",
				"strict"
			>;
		}
	});
});
