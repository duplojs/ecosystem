import * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";

describe("to", () => {
	it("should transform a value to an object", () => {
		const result = DObject.to("Duplo", {
			name: (value) => value,
			length: (value) => value.length,
		});

		expect(result).toEqual({
			name: "Duplo",
			length: 5,
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{
				name: string;
				length: number;
			},
			"strict"
		>;
	});

	it("should keep undefined shape values", () => {
		const result = DObject.to("Duplo", {
			name: (value) => value,
			missing: undefined,
		});

		expect(result).toEqual({
			name: "Duplo",
			missing: undefined,
		});
	});

	it("should transform a value to an object in pipe", () => {
		const result = DCommon.pipe(
			"Duplo",
			DObject.to({
				length: (value) => value.length,
			}),
		);

		expect(result).toEqual({
			length: 5,
		});
	});
});
