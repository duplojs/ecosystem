import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("endsWith", () => {
	it("should validate string end", () => {
		expect(DString.endsWith("user-api", "api")).toBe(true);
		expect(DString.endsWith("admin", "api")).toBe(false);
	});

	it("should narrow a string end inside a pipe when callback", () => {
		const source = "user-api" as "user-api" | "admin";
		const result = DCommon.pipe(
			source,
			DCommon.when(
				DString.endsWith("api"),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
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
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				"user-api",
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
