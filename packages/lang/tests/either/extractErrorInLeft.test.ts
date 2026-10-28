import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("extractErrorInLeft", () => {
	class MissingError extends DCommon.DuploJSError.parentClass("missing") {}
	class ForbiddenError extends DCommon.DuploJSError.parentClass("forbidden") {}
	class UnexpectedError extends DCommon.DuploJSError.parentClass("unexpected") {}

	const missingError = new MissingError("File not found.");
	const forbiddenError = new ForbiddenError("Access denied.");
	const unexpectedError = new UnexpectedError("Unexpected failure.");

	type Input = (
		| DEither.Left<"operation-error", MissingError | ForbiddenError | UnexpectedError>
		| DEither.Left<"other-error", MissingError | ForbiddenError>
		| DEither.Left<"unrelated", 42>
		| DEither.Right<"success", MissingError>
		| null
		| undefined
		| "plain"
	);

	it("extracts one error and preserves the remaining left information and values", () => {
		const input = DEither.left("operation-error", missingError) as Input;
		const result = DEither.extractErrorInLeft(input, "missing");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"operation-error", ForbiddenError | UnexpectedError>
			| DEither.Left<"other-error", ForbiddenError>
			| DEither.Left<"missing", MissingError>
			| DEither.Left<"unrelated", 42>
			| DEither.Right<"success", MissingError>
			| null
			| undefined
			| "plain",
			"strict"
		>;

		expect(DEither.isLeft(result)).toBe(true);
		expect(DEither.unwrapByInformationOrThrow(result, "missing")).toBe(missingError);
		expect(DEither.unwrapByInformationOrThrow(input, "operation-error")).toBe(missingError);
	});

	it.each([
		{
			input: DEither.left("operation-error", forbiddenError),
			information: "forbidden",
			expected: forbiddenError,
		},
		{
			input: DEither.left("other-error", missingError),
			information: "missing",
			expected: missingError,
		},
	] as const)("extracts multiple identifiers in a pipe ($information)", ({ input, information, expected }) => {
		const result = DCommon.pipe(
			input as Input,
			DEither.extractErrorInLeft(["missing", "forbidden"]),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DEither.Left<"operation-error", UnexpectedError>
			| DEither.Left<"missing", MissingError>
			| DEither.Left<"forbidden", ForbiddenError>
			| DEither.Left<"unrelated", 42>
			| DEither.Right<"success", MissingError>
			| null
			| undefined
			| "plain",
			"strict"
		>;

		expect(DEither.unwrapByInformationOrThrow(result, information)).toBe(expected);
	});

	it("accepts multiple identifiers in the direct form", () => {
		const input = DEither.left("operation-error", forbiddenError) as DEither.Left<"operation-error", MissingError | ForbiddenError>;
		const result = DEither.extractErrorInLeft(input, ["missing", "forbidden"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Left<"missing", MissingError> | DEither.Left<"forbidden", ForbiddenError>,
			"strict"
		>;

		expect(DEither.unwrapByInformationOrThrow(result, "forbidden")).toBe(forbiddenError);
	});

	it("removes an exhausted left and allows discrimination in a pipe", () => {
		const result = DCommon.pipe(
			DEither.left("operation-error", missingError),
			DEither.extractErrorInLeft("missing"),
			DEither.whenHasInformation("missing", (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, MissingError, "strict">;
				return error.message;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
		expect(result).toBe("File not found.");
	});

	it.each([
		{ input: DEither.left("operation-error", forbiddenError) },
		{ input: DEither.left("operation-error", unexpectedError) },
		{ input: DEither.left("unrelated", 42) },
		{ input: DEither.right("success", missingError) },
		{ input: null },
		{ input: undefined },
		{ input: "plain" },
	])("preserves unselected lefts, rights and other values (%#)", ({ input }) => {
		const result = DEither.extractErrorInLeft(input as Input, "missing");

		expect(result).toBe(input);
	});

	it("preserves an unselected error in a pipe", () => {
		const input = DEither.left("operation-error", unexpectedError) as Input;
		const result = DCommon.pipe(input, DEither.extractErrorInLeft("missing"));

		expect(result).toBe(input);
		expect(DEither.unwrapByInformationOrThrow(result, "operation-error")).toBe(unexpectedError);
	});

	it("extracts errors from left values mixed with ordinary values", () => {
		const input = DEither.left("mixed", missingError) as DEither.Left<"mixed", MissingError | ForbiddenError | "fallback" | Error>;
		const result = DEither.extractErrorInLeft(input, "missing");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Left<"mixed", ForbiddenError | "fallback" | Error> | DEither.Left<"missing", MissingError>,
			"strict"
		>;

		expect(DEither.unwrapByInformationOrThrow(result, "missing")).toBe(missingError);
	});

	it.each([
		{ value: new Error("Ordinary error.") },
		{ value: "fallback" },
	])("preserves ordinary values inside mixed lefts (%#)", ({ value }) => {
		const input = DEither.left("mixed", value) as DEither.Left<"mixed", MissingError | Error | string>;
		const result = DCommon.pipe(input, DEither.extractErrorInLeft("missing"));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Left<"mixed", Error | string> | DEither.Left<"missing", MissingError>,
			"strict"
		>;

		expect(result).toBe(input);
		expect(DEither.unwrapByInformationOrThrow(result, "mixed")).toBe(value);
	});

	it("keeps the input type and reference for an empty selection", () => {
		const input = DEither.left("operation-error", missingError) as Input;
		const result = DEither.extractErrorInLeft(input, []);
		const pipedResult = DCommon.pipe(input, DEither.extractErrorInLeft([]));

		type _CheckResult = DCommon.ExpectType<typeof result, Input, "strict">;
		type _CheckPipedResult = DCommon.ExpectType<typeof pipedResult, Input, "strict">;
		expect(result).toBe(input);
		expect(pipedResult).toBe(input);
	});

	it("rejects identifiers absent from left values in both forms", () => {
		const input = DEither.left("operation-error", missingError) as (
			| DEither.Left<"operation-error", MissingError>
			| DEither.Right<"success", ForbiddenError>
		);

		// @ts-expect-error identifier must belong to a left value, not a right value
		DEither.extractErrorInLeft(input, "forbidden");
		// @ts-expect-error the left information is not an error identifier
		DEither.extractErrorInLeft(input, "operation-error");
		// @ts-expect-error every selected identifier must belong to a left value
		DEither.extractErrorInLeft(input, ["missing", "unknown"]);
		DCommon.pipe(
			input,
			// @ts-expect-error identifier must belong to the piped left values
			DEither.extractErrorInLeft("forbidden"),
		);
	});
});
