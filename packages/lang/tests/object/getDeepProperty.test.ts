import { DObject, pipe, type ExpectType } from "@scripts";

describe("getDeepProperty", () => {
	it("should get a nested property", () => {
		const source = {
			profile: {
				name: "Duplo",
			},
		} as const;

		const result = DObject.getDeepProperty(source, "profile.name");
		expect(result).toBe("Duplo");

		type _CheckResult = ExpectType<
			typeof result,
			"Duplo",
			"strict"
		>;
	});

	it("should get a top level property", () => {
		const source = {
			name: "Duplo",
		} as const;

		expect(DObject.getDeepProperty(source, "name")).toBe("Duplo");
	});

	it("should get a nested property in pipe", () => {
		const result = pipe(
			{
				profile: {
					name: "Duplo",
				},
			} as const,
			DObject.getDeepProperty("profile.name"),
		);

		expect(result).toBe("Duplo");
	});
});
