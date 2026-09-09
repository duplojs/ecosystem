import { DCommon, type ExpectType } from "@scripts";

describe("clone", () => {
	it("returns primitive and falsy values directly", () => {
		expect(DCommon.clone(false)).toBe(false);
		expect(DCommon.clone(null)).toBeNull();
		expect(DCommon.clone("value")).toBe("value");
	});

	it("deep clones objects and arrays", () => {
		const input = {
			name: "Jane",
			nested: {
				values: [1, { enabled: true }],
			},
		};
		const result = DCommon.clone(input);

		type _CheckResult = ExpectType<
			typeof result,
			{
				name: string;
				nested: {
					values: (
						| number
						| {
							enabled: boolean;
						}
					)[];
				};
			},
			"strict"
		>;

		expect(result).toStrictEqual(input);
		expect(result).not.toBe(input);
		expect(result.nested).not.toBe(input.nested);
		expect(result.nested.values).not.toBe(input.nested.values);
		expect(result.nested.values[1]).not.toBe(input.nested.values[1]);
	});
});
