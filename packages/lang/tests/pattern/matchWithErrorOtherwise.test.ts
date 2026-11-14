import * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";
import * as DPattern from "@scripts/pattern";
import * as DPath from "@scripts/path";

describe("matchWithErrorOtherwise", () => {
	class MessageError extends DCommon.DuploJSError.parentClass("message") {}
	class CausedError extends DCommon.DuploJSError.parentClass("caused", Error) {}
	type Input = MessageError | CausedError;

	it.each([
		new DCommon.AssertsError(42),
		new DPath.CreatePathError("invalid"),
	])("handles existing Lang errors and narrows the fallback", (input) => {
		const result = DPattern.matchWithErrorOtherwise(input, {
			"common-asserts-error": (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, DCommon.AssertsError, "strict">;
				return 42 as const;
			},
		}, (error) => {
			type _CheckError = DCommon.ExpectType<typeof error, DPath.CreatePathError, "strict">;
			return error.value;
		});

		type _CheckResult = DCommon.ExpectType<typeof result, 42 | string, "strict">;
		expect(result).toBe(input.value);
	});

	it("narrows both the selected handler and the remaining error in the fallback", () => {
		const input = new CausedError(new Error("Original error.")) as Input;
		const onHandled = vi.fn();
		const otherwise = vi.fn((_error: MessageError) => 42 as const);

		const result = DPattern.matchWithErrorOtherwise(input, {
			caused: (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, CausedError, "strict">;
				type _CheckCause = DCommon.ExpectType<typeof error.cause, Error, "strict">;
				onHandled(error);
				return error.cause.message;
			},
		}, (error) => {
			type _CheckError = DCommon.ExpectType<typeof error, MessageError, "strict">;
			type _CheckCause = DCommon.ExpectType<typeof error.cause, undefined, "strict">;
			return otherwise(error);
		});

		type _CheckResult = DCommon.ExpectType<typeof result, string | 42, "strict">;
		expect(result).toBe("Original error.");
		expect(onHandled).toHaveBeenCalledExactlyOnceWith(input);
		expect(otherwise).not.toHaveBeenCalled();
	});

	it("calls the fallback with the original unhandled error in direct form", () => {
		const input = new CausedError(new Error("Original error.")) as Input;
		const handled = vi.fn((_error: MessageError) => "handled");
		const otherwise = vi.fn();

		const result = DPattern.matchWithErrorOtherwise(input, {
			message: handled,
		}, (error) => {
			type _CheckError = DCommon.ExpectType<typeof error, CausedError, "strict">;
			otherwise(error);
			return error.cause;
		});

		type _CheckResult = DCommon.ExpectType<typeof result, string | Error, "strict">;
		expect(result).toBe(input.cause);
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(input);
		expect(handled).not.toHaveBeenCalled();
	});

	it.each([true, false])("infers handled and unhandled errors in a pipe (handled: %s)", (isHandled) => {
		const cause = new Error("Original error.");
		const input = isHandled
			? new MessageError("Invalid value.")
			: new CausedError(cause);

		const result = DCommon.pipe(
			input,
			DPattern.matchWithErrorOtherwise({
				message: (error) => {
					type _CheckError = DCommon.ExpectType<typeof error, MessageError, "strict">;
					return error.message;
				},
			}, (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, CausedError, "strict">;
				type _CheckCause = DCommon.ExpectType<typeof error.cause, Error, "strict">;
				return error.cause;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | Error, "strict">;
		expect(result).toBe(isHandled ? "Invalid value." : cause);
	});

	it("infers curried functions passed as the handler and fallback", () => {
		const input = new CausedError(new Error("Original error.")) as Input;
		const result = DCommon.pipe(
			input,
			DPattern.matchWithErrorOtherwise(
				{ message: DObject.getProperty("message") },
				DObject.getProperty("cause"),
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | Error, "strict">;
		expect(result).toBe(input.cause);
	});

	it("delegates every error to the fallback when the matcher is empty", () => {
		const input = new MessageError("Invalid value.") as Input;
		const result = DPattern.matchWithErrorOtherwise(input, {}, (error) => {
			type _CheckError = DCommon.ExpectType<typeof error, Input, "strict">;
			return error;
		});

		type _CheckResult = DCommon.ExpectType<typeof result, Input, "strict">;
		expect(result).toBe(input);
	});

	it("ignores inherited matcher properties when selecting the fallback", () => {
		class ConstructorError extends DCommon.DuploJSError.parentClass("constructor") {}
		const input = new ConstructorError("Invalid constructor.");
		const otherwise = vi.fn((error: ConstructorError) => error.message);
		const result = DPattern.matchWithErrorOtherwise(input, {}, otherwise);

		expect(result).toBe("Invalid constructor.");
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("ignores the inherited constructor handler in curried form", () => {
		class ConstructorError extends DCommon.DuploJSError.parentClass("constructor") {}
		const input = new ConstructorError("Invalid constructor.");
		const otherwise = vi.fn();
		const result = DCommon.pipe(
			input,
			DPattern.matchWithErrorOtherwise({}, (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, ConstructorError, "strict">;

				otherwise(error);
				return error.message;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
		expect(result).toBe("Invalid constructor.");
		expect(otherwise).toHaveBeenCalledExactlyOnceWith(input);
	});

	it("infers an own constructor handler in direct and curried forms", () => {
		class ConstructorError extends DCommon.DuploJSError.parentClass("constructor") {}
		const input = new ConstructorError("Invalid constructor.");
		const directResult = DPattern.matchWithErrorOtherwise(input, {
			constructor: (error) => {
				type _CheckError = DCommon.ExpectType<typeof error, ConstructorError, "strict">;

				return error.message;
			},
		}, () => false as const);
		const curriedResult = DCommon.pipe(
			input,
			DPattern.matchWithErrorOtherwise({
				constructor: (error) => {
					type _CheckError = DCommon.ExpectType<typeof error, ConstructorError, "strict">;

					return error.message;
				},
			}, () => false as const),
		);

		type _CheckDirectResult = DCommon.ExpectType<typeof directResult, string | false, "strict">;
		type _CheckCurriedResult = DCommon.ExpectType<typeof curriedResult, string | false, "strict">;
		expect(directResult).toBe("Invalid constructor.");
		expect(curriedResult).toBe("Invalid constructor.");
	});

	it("rejects undefined handlers in direct and curried forms", () => {
		const input = new MessageError("Invalid value.") as Input;
		class ConstructorError extends DCommon.DuploJSError.parentClass("constructor") {}
		const constructorInput = new ConstructorError("Invalid constructor.");

		if (false) {
			// @ts-expect-error matcher handlers cannot be undefined
			DPattern.matchWithErrorOtherwise(input, { message: undefined }, () => "fallback");

			DCommon.pipe(
				input,
				// @ts-expect-error curried matcher handlers cannot be undefined
				DPattern.matchWithErrorOtherwise({ message: undefined }, () => "fallback"),
			);

			// @ts-expect-error the empty matcher overload must reject an undefined constructor handler
			DPattern.matchWithErrorOtherwise(constructorInput, { constructor: undefined }, () => "fallback");

			DCommon.pipe(
				constructorInput,
				// @ts-expect-error the curried empty matcher overload must reject an undefined constructor handler
				DPattern.matchWithErrorOtherwise({ constructor: undefined }, () => "fallback"),
			);
		}

		expect(true).toBe(true);
	});

	it("narrows the fallback to never when all errors are handled", () => {
		const input = new MessageError("Invalid value.") as Input;
		const result = DPattern.matchWithErrorOtherwise(input, {
			message: (error) => error.message,
			caused: (error) => error.cause.message,
		}, (error) => {
			type _CheckError = DCommon.ExpectType<typeof error, never, "strict">;
			return false as const;
		});

		type _CheckResult = DCommon.ExpectType<typeof result, string | false, "strict">;
		expect(result).toBe("Invalid value.");
	});

	it("rejects unknown identifiers, native errors and broad identifiers", () => {
		const input = new MessageError("Invalid value.") as Input;
		DPattern.matchWithErrorOtherwise(
			input,
			// @ts-expect-error only input identifiers are allowed
			{
				message: () => 42,
				unexpected: () => false,
			},
			() => "fallback",
		);
		const unknownMatcher = {
			message: () => 42,
			unexpected: () => false,
		};
		DCommon.pipe(
			input,
			// @ts-expect-error only piped input identifiers are allowed
			DPattern.matchWithErrorOtherwise(unknownMatcher, () => "fallback"),
		);

		// @ts-expect-error native Error does not carry the DuploJS error kind
		type _CheckNativeError = typeof DPattern.matchWithErrorOtherwise<Error, {}, string>;
		const broadInput = input as DCommon.DuploJSError;
		// @ts-expect-error matching requires literal error identifiers
		DPattern.matchWithErrorOtherwise(broadInput, {}, () => "fallback");
		DCommon.pipe(
			// @ts-expect-error matching in a pipe requires literal error identifiers
			broadInput,
			DPattern.matchWithErrorOtherwise({}, () => "fallback"),
		);
	});
});
