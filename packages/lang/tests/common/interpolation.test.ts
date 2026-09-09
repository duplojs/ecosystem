import { DCommon, type ExpectType } from "@scripts";

describe("createInterpolation", () => {
	it("replaces every placeholder with its value", () => {
		const interpolation = DCommon.createInterpolation("user-{id}-{slug}", true);
		const result = interpolation({
			id: "42",
			slug: "profile",
		});

		type _CheckResult = ExpectType<
			typeof result,
			"user-42-profile",
			"strict"
		>;

		expect(result).toBe("user-42-profile");
	});

	it("allows templates without placeholders", () => {
		const interpolation = DCommon.createInterpolation("static", true);
		const result = interpolation();

		type _CheckResult = ExpectType<
			typeof result,
			"static",
			"strict"
		>;

		expect(result).toBe("static");
	});

	it("returns string when strict mode is disabled", () => {
		const interpolation = DCommon.createInterpolation("user-{id}");
		const result = interpolation({
			id: "42",
		});

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("user-42");
	});

	it("keeps the template when no values are provided at runtime", () => {
		const interpolation = DCommon.createInterpolation("user-{id}");

		expect(interpolation(undefined as never)).toBe("user-{id}");
	});
});
