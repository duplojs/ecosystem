import { DCommon, type ExpectType, pipe, when } from "@scripts";

describe("instanceOf", () => {
	it("checks a single constructor", () => {
		const input = new Date();

		expect(DCommon.instanceOf(input, Date)).toBe(true);
		expect(DCommon.instanceOf("value", Date)).toBe(false);
	});

	it("checks a constructor list", () => {
		expect(DCommon.instanceOf(new Error("failed"), [Date, Error])).toBe(true);
		expect(DCommon.instanceOf("value", [Date, Error])).toBe(false);
	});

	it("narrows direct inputs", () => {
		const format = (input: Date | Error) => {
			if (DCommon.instanceOf(input, Date)) {
				type _CheckInput = ExpectType<
					typeof input,
					Date,
					"strict"
				>;

				return input.getFullYear();
			} else {
				type _CheckInput = ExpectType<
					typeof input,
					Error,
					"strict"
				>;

				return input.message;
			}
		};

		expect(format(new Date("2024-01-01T00:00:00.000Z"))).toBe(2024);
		expect(format(new Error("failed"))).toBe("failed");
	});

	it("supports curried checks in a pipe", () => {
		const result = pipe(
			new Date() as Date | Error,
			when(
				DCommon.instanceOf(Date),
				(input) => input.getTime(),
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number | Error,
			"strict"
		>;

		expect(typeof result).toBe("number");
	});
});
