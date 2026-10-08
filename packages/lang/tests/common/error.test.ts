import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";

describe("DuploJSError", () => {
	it("distinguishes DuploJS errors from ordinary errors and unrelated values", () => {
		expect(DCommon.duploJSErrorKind.has(new Error("Ordinary error."))).toBe(false);
		expect(DCommon.duploJSErrorKind.has({})).toBe(false);
		expect(DCommon.duploJSErrorKind.has(null)).toBe(false);
		expect(new Error("Ordinary error.")).not.toBeInstanceOf(DCommon.DuploJSError);
	});

	describe("parentClass", () => {
		it("exposes the identifier kind declared by the parent class", () => {
			class ValidationError extends DCommon.DuploJSError.parentClass("validation-error") {}
			const kind = DCommon.createKind("duplojs-error-validation-error");
			const error = new ValidationError("Invalid value.");

			type _CheckKind = DCommon.ExpectType<
				Extract<ValidationError, DKind.Kind<typeof kind>>,
				ValidationError,
				"strict"
			>;

			expect(kind.has(error)).toBe(true);
		});

		it("defaults to a string constructor argument and an undefined cause", () => {
			const Parent = DCommon.DuploJSError.parentClass("validation-error");
			class ValidationError extends Parent {}

			const error = new ValidationError("Invalid value.");
			const identifier = DCommon.duploJSErrorKind.getValue(error);

			type _CheckParent = DCommon.ExpectType<
				typeof Parent,
				abstract new(error: string) => (
					& DCommon.DuploJSError<"validation-error", string>
					& DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error-validation-error", unknown>>, unknown>
				),
				"strict"
			>;
			type _CheckParameters = DCommon.ExpectType<
				ConstructorParameters<typeof ValidationError>,
				[error: string],
				"strict"
			>;
			type _CheckCause = DCommon.ExpectType<
				typeof error.cause,
				undefined,
				"strict"
			>;
			type _CheckIdentifier = DCommon.ExpectType<
				typeof identifier,
				"validation-error",
				"strict"
			>;

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(DCommon.DuploJSError);
			expect(error).toBeInstanceOf(Parent);
			expect(error).toBeInstanceOf(ValidationError);
			expect(DCommon.duploJSErrorKind.has(error)).toBe(true);
			expect(identifier).toBe("validation-error");
			expect(error.message).toBe("Invalid value.");
			expect(error.cause).toBeUndefined();
		});

		it("preserves an empty string message without a cause constructor", () => {
			class EmptyMessageError extends DCommon.DuploJSError.parentClass("empty-message") {}

			const error = new EmptyMessageError("");

			type _CheckParameters = DCommon.ExpectType<
				ConstructorParameters<typeof EmptyMessageError>,
				[error: string],
				"strict"
			>;
			type _CheckCause = DCommon.ExpectType<
				typeof error.cause,
				undefined,
				"strict"
			>;

			expect(DCommon.duploJSErrorKind.getValue(error)).toBe("empty-message");
			expect(error.message).toBe("");
			expect(error.cause).toBeUndefined();
		});

		it("requires an Error and exposes a defined Error cause when configured with Error", () => {
			const Parent = DCommon.DuploJSError.parentClass("caused-error", Error);
			class CausedError extends Parent {}

			const cause = new TypeError("Invalid input.");
			const error = new CausedError(cause);

			type _CheckParent = DCommon.ExpectType<
				typeof Parent,
				abstract new(error: Error) => (
						& DCommon.DuploJSError<"caused-error", Error>
						& DKind.Kind<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/duplojs-error-caused-error", unknown>>, unknown>
				),
				"strict"
			>;
			type _CheckParameters = DCommon.ExpectType<
				ConstructorParameters<typeof CausedError>,
				[error: Error],
				"strict"
			>;
			type _CheckCause = DCommon.ExpectType<
				typeof error.cause,
				Error,
				"strict"
			>;

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(DCommon.DuploJSError);
			expect(DCommon.duploJSErrorKind.getValue(error)).toBe("caused-error");
			expect(error.message).toBe("Error received.");
			expect(error.cause).toBe(cause);
		});

		it("preserves a custom Error cause and exposes it after recognizing the wrapper", () => {
			class ValidationError extends DCommon.DuploJSError.parentClass("validation-error") {
				public constructor(
					message: string,
					public readonly field: string,
				) {
					super(message);
				}

				public getField() {
					return this.field;
				}
			}
			class WrappedError extends DCommon.DuploJSError.parentClass("wrapped-error", ValidationError) {}

			const cause = new ValidationError("Value is required.", "name");
			const input: unknown = new WrappedError(cause);

			type _CheckParameters = DCommon.ExpectType<
				ConstructorParameters<typeof WrappedError>,
				[error: ValidationError],
				"strict"
			>;

			expect(input).toBeInstanceOf(WrappedError);
			if (input instanceof WrappedError) {
				type _CheckInput = DCommon.ExpectType<
					typeof input,
					WrappedError,
					"strict"
				>;
				type _CheckCause = DCommon.ExpectType<
					typeof input.cause,
					ValidationError,
					"strict"
				>;
				const identifier = DCommon.duploJSErrorKind.getValue(input.cause);
				type _CheckCauseIdentifier = DCommon.ExpectType<
					typeof identifier,
					"validation-error",
					"strict"
				>;

				expect(DCommon.duploJSErrorKind.getValue(input)).toBe("wrapped-error");
				expect(input.message).toBe("Error received.");
				expect(input.cause).toBe(cause);
				expect(input.cause.getField()).toBe("name");
				expect(input.cause.message).toBe("Value is required.");
				expect(input.cause.cause).toBeUndefined();
			} else {
				expect.unreachable("The wrapper must be recognized.");
			}
		});

		it("exposes an undefined cause after recognizing a default string error", () => {
			class MessageError extends DCommon.DuploJSError.parentClass("message-error") {}
			const input: unknown = new MessageError("Invalid value.");

			if (input instanceof MessageError) {
				type _CheckCause = DCommon.ExpectType<
					typeof input.cause,
					undefined,
					"strict"
				>;

				expect(input.cause).toBeUndefined();
			} else {
				expect.unreachable("The message error must be recognized.");
			}
		});

		it("does not recognize a string error as an error with a defined cause", () => {
			class MessageError extends DCommon.DuploJSError.parentClass("message-error") {}
			class CausedError extends DCommon.DuploJSError.parentClass("caused-error", Error) {}

			const error = new MessageError("Invalid value.");

			expect(error.cause).toBeUndefined();
			expect(error).not.toBeInstanceOf(CausedError);
		});

		it("does not recognize an Error cause as a more specific custom Error cause", () => {
			class ValidationError extends DCommon.DuploJSError.parentClass("validation-error") {
				public readonly field = "name";
			}
			class CausedError extends DCommon.DuploJSError.parentClass("caused-error", Error) {}
			class WrappedError extends DCommon.DuploJSError.parentClass("wrapped-error", ValidationError) {}

			const error = new CausedError(new Error("Invalid value."));

			expect(error.cause).not.toBeInstanceOf(ValidationError);
			expect(error).not.toBeInstanceOf(WrappedError);
		});
	});
});
