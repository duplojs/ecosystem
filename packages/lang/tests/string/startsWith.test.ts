import { DString, pipe, when, type ExpectType } from "@scripts";

describe("startsWith", () => {
	it("should validate string start", () => {
		expect(DString.startsWith("api-user", "api")).toBe(true);
		expect(DString.startsWith("admin", "api")).toBe(false);
	});

	it("should narrow a string start inside a pipe when callback", () => {
		const source = "api-user" as "api-user" | "admin";
		const result = pipe(
			source,
			when(
				DString.startsWith("api"),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						"api-user",
						"strict"
					>;

					return value.toUpperCase();
				},
			),
		);

		expect(result).toBe("API-USER");
	});

	it("should narrow a string union to values starting with the search string", () => {
		const source = "api-user" as "api-user" | "admin";

		if (DString.startsWith(source, "api")) {
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
