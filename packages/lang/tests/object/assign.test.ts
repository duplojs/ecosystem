import { DObject, pipe, type ExpectType } from "@scripts";

describe("assign", () => {
	it("should assign values to an object", () => {
		const result = DObject.assign(
			{
				name: "Duplo",
				count: 1,
			},
			{
				count: 2 as const,
				enabled: true as const,
			},
		);

		expect(result).toEqual({
			name: "Duplo",
			count: 2,
			enabled: true,
		});

		type _CheckResult = ExpectType<
			typeof result,
			{
				name: string;
				count: 2;
				enabled: true;
			},
			"strict"
		>;
	});

	it("should assign values in pipe", () => {
		const result = pipe(
			{
				name: "Duplo",
				count: 1,
			},
			DObject.assign({ count: 2 as const }),
		);

		expect(result).toEqual({
			name: "Duplo",
			count: 2,
		});
	});
});
