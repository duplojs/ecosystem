import * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";

describe("startsWith", () => {
	it("should validate string start", () => {
		expect(DString.startsWith("api-user", "api")).toBe(true);
		expect(DString.startsWith("admin", "api")).toBe(false);
	});

	it("should narrow a string start inside a pipe when callback", () => {
		const source = "api-user" as "api-user" | "admin";
		const result = DCommon.pipe(
			source,
			DCommon.when(
				DString.startsWith("api"),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
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
