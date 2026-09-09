import { DCommon, type ExpectType } from "@scripts";

describe("truthy", () => {
	it("detects truthy and falsy values", () => {
		expect(DCommon.truthy("value")).toBe(true);
		expect(DCommon.truthy(1)).toBe(true);
		expect(DCommon.truthy("")).toBe(false);
		expect(DCommon.truthy(0)).toBe(false);
		expect(DCommon.truthy(null)).toBe(false);
	});

	it("narrows falsy values out of a union", () => {
		const getLength = (input: string | undefined) => {
			if (DCommon.truthy(input)) {
				type _CheckInput = ExpectType<
					typeof input,
					string,
					"strict"
				>;

				return input.length;
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					undefined,
					"strict"
				>;

				return 0;
			}
		};

		expect(getLength("value")).toBe(5);
		expect(getLength(undefined)).toBe(0);
	});
});
