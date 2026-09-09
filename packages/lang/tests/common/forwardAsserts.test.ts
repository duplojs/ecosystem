import { DCommon, pipe, type ExpectType } from "@scripts";

describe("forwardAssert", () => {
	it("forwards the narrowed value when the predicate accepts it", () => {
		const value = "value" as string | number;
		const result = DCommon.forwardAsserts(
			value,
			(input): input is string => typeof input === "string",
		);

		expect(result.toUpperCase()).toBe("VALUE");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("forwards the original value when a boolean predicate accepts it", () => {
		const value = "value" as string | number;
		const result = DCommon.forwardAsserts(
			value,
			(input) => Boolean(input),
		);

		expect(result).toBe(value);

		type _CheckResult = ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});

	it("throws a dedicated error when the predicate rejects the value", () => {
		const value = 10 as string | number;

		expect(
			() => DCommon.forwardAsserts(
				value,
				(input): input is string => typeof input === "string",
			),
		).toThrowError(DCommon.AssertsError);

		try {
			DCommon.forwardAsserts(
				value,
				(input): input is string => typeof input === "string",
			);
		} catch (error) {
			expect(error).toBeInstanceOf(DCommon.AssertsError);

			if (error instanceof DCommon.AssertsError) {
				expect(error.message).toBe("Asserts Error.");
				expect(error.value).toBe(value);
			}
		}
	});

	it("forwards the narrowed value in a pipe", () => {
		const result = pipe(
			"value" as string | number,
			DCommon.forwardAsserts(
				(input): input is string => typeof input === "string",
			),
			(input) => input.length,
		);

		expect(result).toBe(5);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;
	});

	it("throws a dedicated error from the pipe form when the predicate rejects the value", () => {
		const value = 10 as string | number;

		expect(
			() => pipe(
				value,
				DCommon.forwardAsserts(
					(input): input is string => typeof input === "string",
				),
			),
		).toThrowError(DCommon.AssertsError);
	});
});
