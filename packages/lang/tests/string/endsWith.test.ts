import { DString, pipe, when, type ExpectType } from "@scripts";

describe("endsWith", () => {
	it("should validate string end", () => {
		expect(DString.endsWith("user-api", "api")).toBe(true);
		expect(DString.endsWith("admin", "api")).toBe(false);
	});

	it("should narrow a string end inside a pipe when callback", () => {
		const source = "user-api" as "user-api" | "admin";
		const result = pipe(
			source,
			when(
				DString.endsWith("api"),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						"user-api",
						"strict"
					>;

					return value.toUpperCase();
				},
			),
		);

		expect(result).toBe("USER-API");
	});

	it("should narrow a string union to values ending with the search string", () => {
		const source = "user-api" as "user-api" | "admin";

		if (DString.endsWith(source, "api")) {
			type _CheckSource = ExpectType<
				typeof source,
				"user-api",
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
