import * as DPath from "@scripts/path";
import * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";

describe("matchWithError", () => {
	class MessageError extends DCommon.DuploJSError.parentClass("message") {}
	class CausedError extends DCommon.DuploJSError.parentClass("caused", Error) {}
	type Input = MessageError | CausedError;

	it.each([
		new DCommon.AssertsError(42),
		new DPath.CreatePathError("invalid"),
	])("narrows errors from different Lang domains in direct and piped matches", (input) => {
		const result = DPattern.matchWithError(input, {
			"common-asserts-error": (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, DCommon.AssertsError, "strict">;
				return error.value;
			},
			"path-create-path-error": (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, DPath.CreatePathError, "strict">;
				return error.value;
			},
		});
		expect(result).toBe(input.value);

		const pipedResult = DCommon.pipe(
			input,
			DPattern.matchWithError({
				"common-asserts-error": (error) => {
					type _CheckError = DCommon.ExpectType<typeof error, DCommon.AssertsError, "strict">;
					return 42 as const;
				},
				"path-create-path-error": (error) => {
					type _CheckError = DCommon.ExpectType<typeof error, DPath.CreatePathError, "strict">;
					return error.value;
				},
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof pipedResult, 42 | string, "strict">;
		expect(pipedResult).toBe(input.value);
	});

	it("matches the generic error identifier and narrows the handler and cause", () => {
		const cause = new Error("Original error.");
		const input = new CausedError(cause) as Input;
		const onMessage = vi.fn();
		const onCaused = vi.fn();

		const result = DPattern.matchWithError(input, {
			message: (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, MessageError, "strict">;
				type _CheckCause = DCommon.ExpectType<typeof error.cause, undefined, "strict">;
				onMessage(error);
				return 42 as const;
			},
			caused: (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, CausedError, "strict">;
				type _CheckCause = DCommon.ExpectType<typeof error.cause, Error, "strict">;
				onCaused(error);
				return error.cause.message;
			},
		});

		type _CheckResult = DCommon.ExpectType<typeof result, 42 | string, "strict">;
		expect(result).toBe("Original error.");
		expect(onCaused).toHaveBeenCalledExactlyOnceWith(input);
		expect(onMessage).not.toHaveBeenCalled();
	});

	it("infers narrowed handlers and their return union in a pipe", () => {
		const input = new MessageError("Invalid value.") as Input;
		const result = DCommon.pipe(
			input,
			DPattern.matchWithError({
				message: (error) => {
					type _CheckError = DCommon.ExpectType<typeof error, MessageError, "strict">;
					type _CheckCause = DCommon.ExpectType<typeof error.cause, undefined, "strict">;
					return error.message;
				},
				caused: (error) => {
					type _CheckError = DCommon.ExpectType<typeof error, CausedError, "strict">;
					type _CheckCause = DCommon.ExpectType<typeof error.cause, Error, "strict">;
					return error.cause;
				},
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | Error, "strict">;
		expect(result).toBe("Invalid value.");
	});

	it("infers curried functions used directly as handlers", () => {
		const input = new CausedError(new Error("Original error.")) as Input;
		const result = DCommon.pipe(
			input,
			DPattern.matchWithError({
				message: DObject.getProperty("message"),
				caused: DObject.getProperty("cause"),
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | Error, "strict">;
		expect(result).toBe(input.cause);
	});

	it("matches identifiers with the same names as Object prototype properties", () => {
		class ConstructorError extends DCommon.DuploJSError.parentClass("constructor") {}
		const input = new ConstructorError("Invalid constructor.");
		const result = DPattern.matchWithError(input, {
			constructor: (error) => error.message,
		});

		expect(result).toBe("Invalid constructor.");
	});

	it("rejects missing and additional identifiers in both forms", () => {
		const input = new MessageError("Invalid value.") as Input;

		// @ts-expect-error all identifiers must be handled
		DPattern.matchWithError(input, { message: () => 42 });
		// @ts-expect-error only input identifiers are allowed
		DPattern.matchWithError(input, {
			message: () => 42,
			caused: () => "cause",
			unexpected: () => false,
		});

		DCommon.pipe(
			input,
			// @ts-expect-error all piped identifiers must be handled
			DPattern.matchWithError({ message: () => 42 }),
		);
		DCommon.pipe(
			input,
			DPattern.matchWithError(
				// @ts-expect-error only piped input identifiers are allowed
				{
					message: () => 42,
					caused: () => "cause",
					unexpected: () => false,
				},
			),
		);
	});

	it("rejects native errors and non-literal error identifiers", () => {
		// @ts-expect-error native Error does not carry the DuploJS error kind
		type _CheckNativeError = typeof DPattern.matchWithError<Error, {}>;
		const input = new MessageError("Invalid value.") as DCommon.DuploJSError;

		// @ts-expect-error matching requires literal error identifiers
		DPattern.matchWithError(input, { message: () => 42 });
		DCommon.pipe(
			// @ts-expect-error matching in a pipe requires literal error identifiers
			input,
			DPattern.matchWithError({ message: () => 42 }),
		);
	});
});
