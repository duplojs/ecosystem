import type * as DCommon from "@scripts/common";
import type * as DPath from "@scripts/path";
import type * as DString from "@scripts/string";

describe("ConstraintInput", () => {
	it("preserves valid inputs and exposes cast diagnostics for invalid inputs", () => {
		type Target = string & DString.MinCharacters<3>;

		type _CheckSuccess = DCommon.ExpectType<DCommon.ConstraintInput<"hello", Target>, "hello", "strict">;
		type _CheckError = DCommon.ExpectType<
			DCommon.IsExtends<DCommon.ConstraintInput<"hi", Target>, DCommon.CastError<string, unknown, unknown>>,
			true,
			"strict"
		>;
		type _CheckValueMismatch = DCommon.ExpectType<
			DCommon.ConstraintInput<"42", number>,
			"42" & DCommon.CastError<"Input value are not Extends", "42", number>,
			"strict"
		>;
	});

	it("prevalidates a generic function argument while preserving inference", () => {
		type AbsolutePath = string & DPath.Absolute & DPath.Path;

		function useAbsolutePath<const GenericInput extends string>(
			value: DCommon.ConstraintInput<GenericInput, AbsolutePath>,
		): GenericInput {
			return value;
		}

		const result = useAbsolutePath("/folder/file.txt");
		const provenInput = "/folder/file.txt" as AbsolutePath;
		const provenResult = useAbsolutePath(provenInput);

		expect(result).toBe("/folder/file.txt");
		expect(provenResult).toBe(provenInput);

		type _CheckResult = DCommon.ExpectType<typeof result, "/folder/file.txt", "strict">;
		type _CheckProvenResult = DCommon.ExpectType<typeof provenResult, AbsolutePath, "strict">;

		// @ts-expect-error the relative path does not prove Absolute.
		useAbsolutePath("folder/file.txt");
		// @ts-expect-error the broad string does not prove Absolute or Path.
		useAbsolutePath("/folder/file.txt" as string);
	});

	it("checks the underlying value type as well as its constraints", () => {
		function useNumber<const GenericInput extends unknown>(
			value: GenericInput & DCommon.ConstraintInput<GenericInput, number>,
		): GenericInput {
			return value;
		}

		const result = useNumber(42);

		expect(result).toBe(42);

		type _CheckResult = DCommon.ExpectType<typeof result, 42, "strict">;

		// @ts-expect-error a string is not assignable to number.
		useNumber("42");
	});
});
