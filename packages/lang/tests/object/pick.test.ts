import { DObject, pipe, type ExpectType } from "@scripts";

describe("pick", () => {
	it("should pick keys from an array", () => {
		const source = {
			name: "Duplo",
			version: 1,
			enabled: true,
		} as const;

		const result = DObject.pick(source, ["name", "enabled"] as const);
		expect(result).toEqual({
			name: "Duplo",
			enabled: true,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				readonly name: "Duplo";
				readonly enabled: true;
			},
			"strict"
		>;
	});

	it("should pick keys from an object matcher", () => {
		const result = DObject.pick(
			{
				name: "Duplo",
				version: 1,
				enabled: true,
			},
			{
				name: true,
				enabled: false,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
		});
	});

	it("should pick keys in pipe", () => {
		const result = pipe(
			{
				name: "Duplo",
				version: 1,
			} as const,
			DObject.pick(["version"] as const),
		);

		expect(result).toEqual({
			version: 1,
		});
	});
});
