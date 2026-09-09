import { DEither, pipe, type ExpectType } from "@scripts";

describe("matchInformation", () => {
	it("should match every information value", () => {
		const input = (
			Math.random() > -1
				? DEither.success(42)
				: DEither.error("message")
		);

		const result = DEither.matchInformation(input, {
			success: () => 84,
			error: (value) => {
				expect(value).toBe("message");
				return "MESSAGE";
			},
		});

		expect(result).toBe(84);

		type _CheckResult = ExpectType<
			typeof result,
			number | string,
			"strict"
		>;

		// @ts-expect-error matcher must handle every input information
		DEither.matchInformation(input, {
			success: (value) => value,
		});
	});

	it("should match information in pipe", () => {
		const input = (
			Math.random() > -1
				? DEither.error("message")
				: DEither.success(42)
		);

		const result = pipe(
			input,
			DEither.matchInformation({
				success: (value) => value,
				error: (value) => {
					expect(value).toBe("message");
					return "MESSAGE";
				},
			}),
		);

		expect(result).toBe("MESSAGE");

		type _CheckResult = ExpectType<
			typeof result,
			42 | string,
			"strict"
		>;
	});

	it("should keep non either values unchanged", () => {
		const result = DEither.matchInformation("plain", {});

		expect(result).toBe("plain");
	});
});
