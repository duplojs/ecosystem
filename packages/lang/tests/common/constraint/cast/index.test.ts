import { cast, type DArray, type DCommon, type DNumber, type CastError, type DPath, type DString, shameOnYou, type ExpectType } from "@scripts";

describe("cast", () => {
	it("cast maxCharacters", () => {
		const value1: string & DString.MaxCharacters<12> = cast("" as string & DString.MaxCharacters<12>);

		const value2: string & DString.MaxCharacters<12> = cast("" as string & DString.MaxCharacters<6>);

		const value3: string & DString.MaxCharacters<12> = cast(
			"" as string & DString.MaxCharacters<15> & CastError<
				"Impossible to cast on MaxCharacters<12> because constraint MaxCharacters<15> from the value is more than.",
				string & DString.MaxCharacters<15>,
				DString.MaxCharacters<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: string & DString.MaxCharacters<12> = cast("" as string & DString.MaxCharacters<15>);

		const value4: string & DString.MaxCharacters<12> = cast("" as string & DString.LengthEqual<12>);

		const value5: string & DString.MaxCharacters<12> = cast("" as string & DString.LengthEqual<6>);

		const value6: string & DString.MaxCharacters<12> = cast(
			"" as string & DString.LengthEqual<15> & CastError<
				"Impossible to cast on MaxCharacters<12> because constraint LengthEqual<15> from the value is more than.",
				string & DString.LengthEqual<15>,
				DString.MaxCharacters<12>
			>,
		);
			// @ts-expect-error cause error
		const value65: string & DString.MaxCharacters<12> = cast("" as string & DString.LengthEqual<15>);

		const value7: string & DString.MaxCharacters<12> = cast(
			"" as string & DString.MaxCharacters<15> & DString.LengthEqual<6>,
		);
	});

	it("casts a computed constraint while preserving an expected constraint without a cast rule", () => {
		const input = "contact@example.com" as string & DString.Email & DString.MaxCharacters<200>;
		const value: string & DString.Email & DString.MaxCharacters<250> = cast(input);

		type _CheckValue = ExpectType<
			typeof value,
			string & DString.Email & DString.MaxCharacters<250>,
			"strict"
		>;
	});

	it("rejects an incompatible computed constraint when another expected constraint is already present", () => {
		const input = "contact@example.com" as string & DString.Email & DString.MaxCharacters<300>;

		// @ts-expect-error MaxCharacters<300> does not guarantee MaxCharacters<250>.
		const value: string & DString.Email & DString.MaxCharacters<250> = cast(input);
	});

	it("rejects a missing constraint without a cast rule when another expected constraint is already present", () => {
		const input = "contact@example.com" as string & DString.Email & DString.MaxCharacters<200>;
		const inputWithoutFormat = "value" as string & DString.MaxCharacters<200>;

		// @ts-expect-error the input does not carry the expected Url constraint.
		const value: string & DString.Email & DString.Url & DString.MaxCharacters<250> = cast(input);
		// @ts-expect-error the input does not carry the expected Email constraint.
		const email: string & DString.Email & DString.MaxCharacters<250> = cast(inputWithoutFormat);
		// @ts-expect-error the input does not carry the expected Uuid constraint.
		const uuid: string & DString.Uuid & DString.MaxCharacters<250> = cast(inputWithoutFormat);
		// @ts-expect-error the input does not carry the expected Trimmed constraint.
		const trimmed: string & DString.Trimmed & DString.MaxCharacters<250> = cast(inputWithoutFormat);
	});

	it("preserves allowed characters constraints already guaranteed by the input", () => {
		const input = "hello" as string & DString.AllowedCharacters<"a-z"> & DString.MaxCharacters<200>;
		const value1: string & DString.AllowedCharacters<"a-z"> & DString.MaxCharacters<250> = cast(input);
		const value2: string & DString.AllowedCharacters<"a-z" | "0-9"> & DString.MaxCharacters<250> = cast(input);

		type _CheckValue1 = ExpectType<
			typeof value1,
			string & DString.AllowedCharacters<"a-z"> & DString.MaxCharacters<250>,
			"strict"
		>;
		type _CheckValue2 = ExpectType<
			typeof value2,
			string & DString.AllowedCharacters<"a-z" | "0-9"> & DString.MaxCharacters<250>,
			"strict"
		>;
	});

	it("rejects allowed characters constraints not guaranteed by the input", () => {
		const unconstrainedInput = "hello" as string & DString.MaxCharacters<200>;
		const broaderInput = "hello" as string & DString.AllowedCharacters<"a-z" | "0-9"> & DString.MaxCharacters<200>;
		const plainString = "hello" as string;
		const broaderAllowedCharacters = "hello" as string & DString.AllowedCharacters<"a-z" | "0-9">;

		// @ts-expect-error the input does not carry an AllowedCharacters constraint.
		const value1: string & DString.AllowedCharacters<"a-z"> & DString.MaxCharacters<250> = cast(unconstrainedInput);
		// @ts-expect-error a-z | 0-9 does not guarantee that only a-z characters are present.
		const value2: string & DString.AllowedCharacters<"a-z"> & DString.MaxCharacters<250> = cast(broaderInput);
		// @ts-expect-error a plain string does not carry an AllowedCharacters constraint.
		const value3: string & DString.AllowedCharacters<"a-z"> = cast(plainString);
		// @ts-expect-error a-z | 0-9 does not guarantee that only a-z characters are present.
		const value4: string & DString.AllowedCharacters<"a-z"> = cast(broaderAllowedCharacters);
	});

	it("casts allowed characters from compatible string literals", () => {
		const value1: string & DString.AllowedCharacters<"a-z"> = cast("hello");
		const value2: string & DString.AllowedCharacters<"a-z" | "0-9"> = cast("hello123");

		type _CheckValue1 = ExpectType<
			typeof value1,
			string & DString.AllowedCharacters<"a-z">,
			"strict"
		>;
		type _CheckValue2 = ExpectType<
			typeof value2,
			string & DString.AllowedCharacters<"a-z" | "0-9">,
			"strict"
		>;
	});

	it("rejects allowed characters from incompatible string literals", () => {
		const value = cast(
			"hello1" as "hello1" & CastError<
				"Impossible to cast on AllowedCharacters because value hello1 contains forbidden characters.",
				"hello1",
				DString.AllowedCharacters<"a-z">
			>,
		);

		// @ts-expect-error the literal contains a forbidden digit.
		const invalidValue: string & DString.AllowedCharacters<"a-z"> = cast("hello1");

		expect(value).toBe("hello1");
	});

	it("preserves custom constraints with object and callable payloads", () => {
		type NestedConstraint = DCommon.Constraint<
			"custom-nested",
			{ nested: { enabled: true } }
		>;
		type CallableConstraint = DCommon.Constraint<
			"custom-callable",
			() => { enabled: true }
		>;

		const nestedInput = "value" as string & NestedConstraint;
		const callableInput = "value" as string & CallableConstraint;
		const nestedValue: string & NestedConstraint = cast(nestedInput);
		const callableValue: string & CallableConstraint = cast(callableInput);

		type _CheckNestedValue = ExpectType<typeof nestedValue, string & NestedConstraint, "strict">;
		type _CheckCallableValue = ExpectType<typeof callableValue, string & CallableConstraint, "strict">;
	});

	it("rejects missing custom constraints with object and callable payloads", () => {
		type NestedConstraint = DCommon.Constraint<
			"custom-nested",
			{ nested: { enabled: true } }
		>;
		type CallableConstraint = DCommon.Constraint<
			"custom-callable",
			() => { enabled: true }
		>;

		const input = "value" as string & DString.MaxCharacters<10>;

		// @ts-expect-error the input does not carry the expected custom nested constraint.
		const nestedValue: string & NestedConstraint & DString.MaxCharacters<20> = cast(input);
		// @ts-expect-error the input does not carry the expected custom callable constraint.
		const callableValue: string & CallableConstraint & DString.MaxCharacters<20> = cast(input);
	});

	it("infers a string cast target through a generic function argument", () => {
		function testInference<
			GenericResult extends {
				wrap: string & DString.Email & DString.MaxCharacters<250>;
			},
		>(
			arg: GenericResult,
		): GenericResult["wrap"] {
			return arg.wrap;
		}

		const input = "contact@example.com" as string & DString.Email & DString.MaxCharacters<200>;
		const result = testInference({ wrap: cast(input) });

		type _CheckResult = ExpectType<
			typeof result,
			string & DString.Email & DString.MaxCharacters<250>,
			"strict"
		>;
	});

	it("infers a cast target linked to another generic function argument", () => {
		function testInference<
			const GenericInput extends string,
			GenericResult extends {
				wrap:
					& GenericInput
					& DString.MinCharacters<3>
					& DString.MaxCharacters<8>;
			},
		>(
			input: GenericInput,
			arg: GenericResult,
		): GenericResult["wrap"] {
			expect(arg.wrap).toBe(input);
			return arg.wrap;
		}

		const input = "hello" as "hello" & DString.LengthEqual<5>;
		const result = testInference(
			"hello",
			{ wrap: cast(input) },
		);

		type _CheckResult = ExpectType<
			typeof result,
			"hello" & DString.MinCharacters<3> & DString.MaxCharacters<8>,
			"strict"
		>;
	});

	it("infers a number cast target through a generic function argument", () => {
		function testInference<
			GenericResult extends {
				wrap: number & DNumber.GreaterThan<5> & DNumber.LessThan<100>;
			},
		>(
			arg: GenericResult,
		): GenericResult["wrap"] {
			return arg.wrap;
		}

		const input = 42 as number & DNumber.GreaterThan<10> & DNumber.LessThan<50>;
		const result = testInference({ wrap: cast(input) });

		type _CheckResult = ExpectType<
			typeof result,
			number & DNumber.GreaterThan<5> & DNumber.LessThan<100>,
			"strict"
		>;
	});

	it("infers an array cast target through a generic function argument", () => {
		function testInference<
			GenericResult extends {
				wrap: readonly string[] & DArray.MinElements<2> & DArray.MaxElements<5>;
			},
		>(
			arg: GenericResult,
		): GenericResult["wrap"] {
			return arg.wrap;
		}

		const input = ["a", "b", "c"] as unknown as
			& readonly string[]
			& DArray.LengthEqual<3>;
		const result = testInference({ wrap: cast(input) });

		type _CheckResult = ExpectType<
			typeof result,
			readonly string[] & DArray.MinElements<2> & DArray.MaxElements<5>,
			"strict"
		>;
	});

	it("infers a union cast target through a generic function argument", () => {
		function testInference<
			GenericResult extends {
				wrap:
					| (string & DString.Email & DString.MaxCharacters<250>)
					| (string & DString.Url & DString.MinCharacters<5>);
			},
		>(
			arg: GenericResult,
		): GenericResult["wrap"] {
			return arg.wrap;
		}

		const input = "contact@example.com" as string & DString.Email & DString.MaxCharacters<200>;
		const result = testInference({ wrap: cast(input) });

		type _CheckResult = ExpectType<
			typeof result,
			| (string & DString.Email & DString.MaxCharacters<250>)
			| (string & DString.Url & DString.MinCharacters<5>),
			"strict"
		>;
	});

	it("rejects an inferred cast target when a required constraint is missing", () => {
		function testInference<
			GenericResult extends {
				wrap: string & DString.Email & DString.MaxCharacters<250>;
			},
		>(
			arg: GenericResult,
		): GenericResult["wrap"] {
			return arg.wrap;
		}

		const input = "contact@example.com" as string & DString.MaxCharacters<200>;

		// @ts-expect-error the inferred target requires an Email constraint missing from the input.
		const result = testInference({ wrap: cast(input) });
	});

	it("cast minCharacters", () => {
		const value1: string & DString.MinCharacters<12> = cast("" as string & DString.MinCharacters<12>);

		const value2: string & DString.MinCharacters<12> = cast("" as string & DString.MinCharacters<15>);

		const value3: string & DString.MinCharacters<12> = cast(
			"" as string & DString.MinCharacters<6> & CastError<
				"Impossible to cast on MinCharacters<12> because constraint MinCharacters<6> from the value is less than.",
				string & DString.MinCharacters<6>,
				DString.MinCharacters<12>
			>,
		);

		const value4: string & DString.MinCharacters<12> = cast("" as string & DString.LengthEqual<12>);

		const value5: string & DString.MinCharacters<12> = cast("" as string & DString.LengthEqual<15>);

		const value6: string & DString.MinCharacters<12> = cast(
			"" as string & DString.LengthEqual<6> & CastError<
				"Impossible to cast on MinCharacters<12> because constraint LengthEqual<6> from the value is less than.",
				string & DString.LengthEqual<6>,
				DString.MinCharacters<12>
			>,
		);

		const value7: string & DString.MinCharacters<12> = cast(
			"" as string & DString.MinCharacters<6> & DString.LengthEqual<15>,
		);
	});

	it("cast string lengthEqual", () => {
		const value1: string & DString.LengthEqual<12> = cast("" as string & DString.LengthEqual<12>);

		const value2: string & DString.LengthEqual<12> = cast(
			"" as string & DString.LengthEqual<6> & CastError<
				"Impossible to cast on LengthEqual<12> because constraint LengthEqual<6> from the value is not equal.",
				string & DString.LengthEqual<6>,
				DString.LengthEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value25: string & DString.LengthEqual<12> = cast("" as string & DString.LengthEqual<6>);

		const value3: string & DString.LengthEqual<12> = cast(
			"" as string & DString.MaxCharacters<12> & CastError<
				"Impossible to cast on LengthEqual because value does not have LengthEqual constraint.",
				string & DString.MaxCharacters<12>,
				DString.LengthEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: string & DString.LengthEqual<12> = cast("" as string & DString.MaxCharacters<12>);
	});

	it("cast string number", () => {
		const value1: string & DString.Number = cast("12");

		const value2: string & DString.Number = cast("" as string & DString.Number);

		const value3: string & DString.Number = cast(
			"hello" as "hello" & CastError<
				"Impossible to cast on Number because value hello is not a number.",
				"hello",
				DString.Number
			>,
		);
		// @ts-expect-error a non-number string cannot carry Number.
		const value35: string & DString.Number = cast("hello");

		expect(value1).toBe("12");
		expect(value2).toBe("");
		expect(value3).toBe("hello");
	});

	it("cast path", () => {
		const value1: string & DPath.Path = cast("alpha/beta");

		const value2: string & DPath.Path = cast("/alpha/beta");

		const value3: string & DPath.Path = cast("" as string & DPath.Path);

		const value4: string & DPath.Path = cast("" as string & DPath.Absolute);

		const value45: string & DPath.Path = cast("" as string & DPath.Segment);

		const value5: string & DPath.Path = cast(
			"alpha//beta" as "alpha//beta" & CastError<
				"Impossible to cast on Path because value alpha//beta is not path.",
				"alpha//beta",
				DPath.Path
			>,
		);
		// @ts-expect-error double separators are not valid path segments.
		const value55: string & DPath.Path = cast("alpha//beta");

		const value6: string & DPath.Path = cast(
			"" as string & CastError<
				`Impossible to cast on Path because value ${string} is not path.`,
				string,
				DPath.Path
			>,
		);
		// @ts-expect-error a broad string does not guarantee a valid path.
		const value65: string & DPath.Path = cast("" as string);
	});

	it("cast segment path", () => {
		const value1: string & DPath.Segment = cast("alpha");

		const value2: string & DPath.Segment = cast("" as string & DPath.Segment);

		const value3: string & DPath.Segment = cast(
			"alpha/beta" as "alpha/beta" & CastError<
				"Impossible to cast on SegmentPath because value alpha/beta is not segment path.",
				"alpha/beta",
				DPath.Segment
			>,
		);
		// @ts-expect-error a path with separators does not guarantee a segment.
		const value35: string & DPath.Segment = cast("alpha/beta");

		const value4: string & DPath.Segment = cast(
			"" as string & CastError<
				`Impossible to cast on SegmentPath because value ${string} is not segment path.`,
				string,
				DPath.Segment
			>,
		);
		// @ts-expect-error a broad string does not guarantee a segment.
		const value45: string & DPath.Segment = cast("" as string);
	});

	it("cast absolute path", () => {
		const value1: string & DPath.Absolute = cast("/alpha/beta");

		const value2: string & DPath.Absolute = cast("" as string & DPath.Absolute);

		const value3: string & DPath.Absolute = cast(
			"alpha/beta" as "alpha/beta" & CastError<
				"Impossible to cast on AbsolutePath because value alpha/beta is not absolute path.",
				"alpha/beta",
				DPath.Absolute
			>,
		);
		// @ts-expect-error a relative path does not guarantee an absolute path.
		const value35: string & DPath.Absolute = cast("alpha/beta");

		const value4: string & DPath.Absolute = cast(
			"" as string & DPath.Path & CastError<
				`Impossible to cast on AbsolutePath because value ${string & DPath.Path} is not absolute path.`,
				string & DPath.Path,
				DPath.Absolute
			>,
		);
		// @ts-expect-error Path alone does not guarantee an absolute path.
		const value45: string & DPath.Absolute = cast("" as string & DPath.Path);
	});

	it("cast maxElements", () => {
		const value1: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<12>,
		);

		const value2: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<6>,
		);

		const value3: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<15> & CastError<
				"Impossible to cast on MaxElements<12> because constraint MaxElements<15> from the value is more than.",
				readonly unknown[] & DArray.MaxElements<15>,
				DArray.MaxElements<12>
			>,
		);
		const value35: readonly unknown[] & DArray.MaxElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MaxElements<15>,
		);

		const value4: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<12>,
		);

		const value5: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<6>,
		);

		const value6: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<15> & CastError<
				"Impossible to cast on MaxElements<12> because constraint LengthEqual<15> from the value is more than.",
				readonly unknown[] & DArray.LengthEqual<15>,
				DArray.MaxElements<12>
			>,
		);
		const value65: readonly unknown[] & DArray.MaxElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.LengthEqual<15>,
		);

		const value7: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown, unknown],
		);

		const value8: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown],
		);

		const value9: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown, unknown, unknown] & CastError<
				"Impossible to cast on MaxElements<2> because constraint LengthEqual<3> from the value is more than.",
				readonly [unknown, unknown, unknown],
				DArray.MaxElements<2>
			>,
		);
		const value95: readonly unknown[] & DArray.MaxElements<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly [unknown, unknown, unknown],
		);

		const value10: readonly unknown[] & DArray.MaxElements<2> = cast(
			[] as unknown as readonly [unknown, ...unknown[]] & CastError<
				"Impossible to cast on MaxElements because value does not have MaxElements constraint.",
				readonly [unknown, ...unknown[]],
				DArray.MaxElements<2>
			>,
		);
		const value105: readonly unknown[] & DArray.MaxElements<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly [unknown, ...unknown[]],
		);

		const value11: readonly unknown[] & DArray.MaxElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MaxElements<15> & DArray.LengthEqual<6>,
		);
	});

	it("cast minElements", () => {
		const value1: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<12>,
		);

		const value2: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<15>,
		);

		const value3: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<6> & CastError<
				"Impossible to cast on MinElements<12> because constraint MinElements<6> from the value is less than.",
				readonly unknown[] & DArray.MinElements<6>,
				DArray.MinElements<12>
			>,
		);
		const value35: readonly unknown[] & DArray.MinElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MinElements<6>,
		);

		const value4: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<12>,
		);

		const value5: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<15>,
		);

		const value6: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<6> & CastError<
				"Impossible to cast on MinElements<12> because constraint LengthEqual<6> from the value is less than.",
				readonly unknown[] & DArray.LengthEqual<6>,
				DArray.MinElements<12>
			>,
		);
		const value65: readonly unknown[] & DArray.MinElements<12> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.LengthEqual<6>,
		);

		const value7: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown, unknown],
		);

		const value8: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown, unknown, unknown],
		);

		const value9: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown] & CastError<
				"Impossible to cast on MinElements<2> because constraint LengthEqual<1> from the value is less than.",
				readonly [unknown],
				DArray.MinElements<2>
			>,
		);
		const value95: readonly unknown[] & DArray.MinElements<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly [unknown],
		);

		const value10: readonly unknown[] & DArray.MinElements<2> = cast(
			[] as unknown as readonly [unknown, unknown, ...unknown[]],
		);

		const value11: readonly [unknown, ...unknown[]] = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<2>,
		);

		const value12: readonly [unknown, unknown, unknown, ...unknown[]] = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<2> & CastError<
				"Impossible to cast on MinElements<3> because constraint MinElements<2> from the value is less than.",
				readonly unknown[] & DArray.MinElements<2>,
				DArray.MinElements<3>
			>,
		);
		const value125: readonly [unknown, unknown, unknown, ...unknown[]] = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MinElements<2>,
		);

		const value13: readonly [unknown, unknown] = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<2>,
		);

		const value14: readonly unknown[] & DArray.MinElements<12> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<6> & DArray.LengthEqual<15>,
		);
	});

	it("cast array lengthEqual", () => {
		const value1: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<2>,
		);

		const value2: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<3> & CastError<
				"Impossible to cast on LengthEqual<2> because constraint LengthEqual<3> from the value is not equal.",
				readonly unknown[] & DArray.LengthEqual<3>,
				DArray.LengthEqual<2>
			>,
		);
		const value25: readonly unknown[] & DArray.LengthEqual<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.LengthEqual<3>,
		);

		const value3: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly [unknown, unknown],
		);

		const value4: readonly [unknown, unknown] = cast(
			[] as unknown as readonly unknown[] & DArray.LengthEqual<2>,
		);

		const value5: readonly unknown[] & DArray.LengthEqual<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as [unknown, unknown, unknown],
		);

		const value6: readonly unknown[] & DArray.LengthEqual<2> = cast(
			[] as unknown as readonly unknown[] & DArray.MinElements<2> & CastError<
				"Impossible to cast on LengthEqual because value does not have LengthEqual constraint.",
				readonly unknown[] & DArray.MinElements<2>,
				DArray.LengthEqual<2>
			>,
		);
		const value65: readonly unknown[] & DArray.LengthEqual<2> = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly unknown[] & DArray.MinElements<2>,
		);
	});

	it("cast greaterThan", () => {
		const value1: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThan<12>);

		const value2: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThan<15>);

		const value3: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThan<6> & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThan<6> from the value is less than.",
				number & DNumber.GreaterThan<6>,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThan<6>);

		const value4: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThanOrEqual<15>);

		const value5: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<12> & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<12> from the value is less than or equal.",
				number & DNumber.GreaterThanOrEqual<12>,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value55: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThanOrEqual<12>);

		const value6: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<6> & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<6> from the value is less than or equal.",
				number & DNumber.GreaterThanOrEqual<6>,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.GreaterThan<12> = cast(1 as number & DNumber.GreaterThanOrEqual<6>);

		const value7: number & DNumber.GreaterThan<12> = cast(
			1 as number & CastError<
				"Impossible to cast on GreaterThan because value does not have compatible constraint.",
				number,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.GreaterThan<12> = cast(1 as number);

		const value8: number & DNumber.GreaterThan<12> = cast(15);

		const value9: number & DNumber.GreaterThan<12> = cast(
			12 as 12 & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<12> from the value is less than or equal.",
				12,
				DNumber.GreaterThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value95: number & DNumber.GreaterThan<12> = cast(12);

		const value10: number & DNumber.GreaterThan<12> = cast(
			6 as 6 & CastError<
				"Impossible to cast on GreaterThan<12> because constraint GreaterThanOrEqual<6> from the value is less than or equal.",
				6,
				DNumber.GreaterThan<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.GreaterThan<12> = cast(6);

		const value11: number & DNumber.GreaterThan<12> = cast(
			1 as number & DNumber.GreaterThan<6> & DNumber.GreaterThanOrEqual<15>,
		);
	});

	it("cast greaterThanOrEqual", () => {
		const value1: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThanOrEqual<12>);

		const value2: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThanOrEqual<15>);

		const value3: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<6> & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThanOrEqual<6> from the value is less than.",
				number & DNumber.GreaterThanOrEqual<6>,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThanOrEqual<6>);

		const value4: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<12>);

		const value5: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<15>);

		const value6: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThan<6> & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThan<6> from the value is less than.",
				number & DNumber.GreaterThan<6>,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number & DNumber.GreaterThan<6>);

		const value7: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & CastError<
				"Impossible to cast on GreaterThanOrEqual because value does not have compatible constraint.",
				number,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.GreaterThanOrEqual<12> = cast(1 as number);

		const value8: number & DNumber.GreaterThanOrEqual<12> = cast(15);

		const value9: number & DNumber.GreaterThanOrEqual<12> = cast(12);

		const value10: number & DNumber.GreaterThanOrEqual<12> = cast(
			6 as 6 & CastError<
				"Impossible to cast on GreaterThanOrEqual<12> because constraint GreaterThanOrEqual<6> from the value is less than.",
				6,
				DNumber.GreaterThanOrEqual<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.GreaterThanOrEqual<12> = cast(6);

		const value11: number & DNumber.GreaterThanOrEqual<12> = cast(
			1 as number & DNumber.GreaterThanOrEqual<6> & DNumber.GreaterThan<12>,
		);
	});

	it("cast lessThan", () => {
		const value1: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThan<12>);

		const value2: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThan<6>);

		const value3: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThan<15> & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThan<15> from the value is greater than.",
				number & DNumber.LessThan<15>,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThan<15>);

		const value4: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThanOrEqual<6>);

		const value5: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThanOrEqual<12> & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<12> from the value is greater than or equal.",
				number & DNumber.LessThanOrEqual<12>,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value55: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThanOrEqual<12>);

		const value6: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThanOrEqual<15> & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<15> from the value is greater than or equal.",
				number & DNumber.LessThanOrEqual<15>,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.LessThan<12> = cast(1 as number & DNumber.LessThanOrEqual<15>);

		const value7: number & DNumber.LessThan<12> = cast(
			1 as number & CastError<
				"Impossible to cast on LessThan because value does not have compatible constraint.",
				number,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.LessThan<12> = cast(1 as number);

		const value8: number & DNumber.LessThan<12> = cast(6);

		const value9: number & DNumber.LessThan<12> = cast(
			12 as 12 & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<12> from the value is greater than or equal.",
				12,
				DNumber.LessThan<12>
			>,
		);
		// @ts-expect-error cause error
		const value95: number & DNumber.LessThan<12> = cast(12);

		const value10: number & DNumber.LessThan<12> = cast(
			15 as 15 & CastError<
				"Impossible to cast on LessThan<12> because constraint LessThanOrEqual<15> from the value is greater than or equal.",
				15,
				DNumber.LessThan<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.LessThan<12> = cast(15);

		const value11: number & DNumber.LessThan<12> = cast(
			1 as number & DNumber.LessThan<15> & DNumber.LessThanOrEqual<6>,
		);
	});

	it("cast lessThanOrEqual", () => {
		const value1: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThanOrEqual<12>);

		const value2: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThanOrEqual<6>);

		const value3: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThanOrEqual<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThanOrEqual<15> from the value is greater than.",
				number & DNumber.LessThanOrEqual<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value35: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThanOrEqual<15>);

		const value4: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<12>);

		const value5: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<6>);

		const value6: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThan<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThan<15> from the value is greater than.",
				number & DNumber.LessThan<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value65: number & DNumber.LessThanOrEqual<12> = cast(1 as number & DNumber.LessThan<15>);

		const value7: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & CastError<
				"Impossible to cast on LessThanOrEqual because value does not have compatible constraint.",
				number,
				DNumber.LessThanOrEqual<12>
			>,
		);
		// @ts-expect-error cause error
		const value75: number & DNumber.LessThanOrEqual<12> = cast(1 as number);

		const value8: number & DNumber.LessThanOrEqual<12> = cast(6);

		const value9: number & DNumber.LessThanOrEqual<12> = cast(12);

		const value10: number & DNumber.LessThanOrEqual<12> = cast(
			15 as 15 & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThanOrEqual<15> from the value is greater than.",
				15,
				DNumber.LessThanOrEqual<12>
			>,
		);
			// @ts-expect-error cause error
		const value105: number & DNumber.LessThanOrEqual<12> = cast(15);

		const value11: number & DNumber.LessThanOrEqual<12> = cast(
			1 as number & DNumber.LessThanOrEqual<15> & DNumber.LessThan<12>,
		);
	});

	it("cast integer", () => {
		const value1: number & DNumber.Integer = cast(3);

		const value2: number & DNumber.Integer = cast(3 as number & DNumber.Integer);

		const value3: number & DNumber.Integer = cast(
			3.5 as 3.5 & CastError<
				"Impossible to cast on Integer because value 3.5 is not an integer.",
				3.5,
				DNumber.Integer
			>,
		);
		// @ts-expect-error a decimal literal is not an integer.
		const value35: number & DNumber.Integer = cast(3.5);

		const value4: number & DNumber.Integer = cast(
			3 as number & CastError<
				`Impossible to cast on Integer because value ${number} is not an integer.`,
				number,
				DNumber.Integer
			>,
		);
		// @ts-expect-error a broad number does not guarantee an integer.
		const value45: number & DNumber.Integer = cast(3 as number);
	});

	it("cast notZero", () => {
		const value1: number & DNumber.NotZero = cast(-1);

		const value2: number & DNumber.NotZero = cast(1 as number & DNumber.NotZero);

		const value3: number & DNumber.NotZero = cast(
			0 as 0 & CastError<
				"Impossible to cast on NotZero because value 0 is equal to zero.",
				0,
				DNumber.NotZero
			>,
		);
		// @ts-expect-error zero does not satisfy NotZero.
		const value35: number & DNumber.NotZero = cast(0);

		const value4: number & DNumber.NotZero = cast(
			1 as number & CastError<
				`Impossible to cast on NotZero because value ${number} is equal to zero.`,
				number,
				DNumber.NotZero
			>,
		);
		// @ts-expect-error a broad number does not guarantee a non-zero value.
		const value45: number & DNumber.NotZero = cast(1 as number);
	});

	it("cast safe", () => {
		const value1: number & DNumber.Safe = cast(9007199254740991);

		const value2: number & DNumber.Safe = cast(-9007199254740991);

		const value3: number & DNumber.Safe = cast(1 as number & DNumber.Safe);

		const value4: number & DNumber.Safe = cast(
			9007199254740992 as 9007199254740992 & CastError<
				"Impossible to cast on Safe because value 9007199254740992 is not safe.",
				9007199254740992,
				DNumber.Safe
			>,
		);
		// @ts-expect-error the literal exceeds the maximum safe integer.
		const value45: number & DNumber.Safe = cast(9007199254740992);

		const value5: number & DNumber.Safe = cast(
			-9007199254740992 as -9007199254740992 & CastError<
				"Impossible to cast on Safe because value -9007199254740992 is not safe.",
				-9007199254740992,
				DNumber.Safe
			>,
		);
		// @ts-expect-error the literal exceeds the minimum safe integer.
		const value55: number & DNumber.Safe = cast(-9007199254740992);

		const value6: number & DNumber.Safe = cast(
			1 as number & CastError<
				`Impossible to cast on Safe because value ${number} is not safe.`,
				number,
				DNumber.Safe
			>,
		);
		// @ts-expect-error a broad number does not guarantee a safe value.
		const value65: number & DNumber.Safe = cast(1 as number);
	});

	it("union value", () => {
		const value1: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(1 as number & DNumber.LessThanOrEqual<6>);

		const value2: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(
			1 as number & DNumber.LessThanOrEqual<15> & CastError<
				"Impossible to cast on LessThanOrEqual<12> because constraint LessThanOrEqual<15> from the value is greater than.",
				number & DNumber.LessThanOrEqual<15>,
				DNumber.LessThanOrEqual<12>
			>,
		);
		const value25: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		// @ts-expect-error cause error
		) = cast(1 as number & DNumber.LessThanOrEqual<15>);

		const value3: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast("" as string & DString.MaxCharacters<10>);

		const value4: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(
			"" as string & DString.MaxCharacters<100> & CastError<
				"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<100> from the value is more than.",
				string & DString.MaxCharacters<100>,
				DString.MaxCharacters<50>
			>,
		);
		const value45: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		// @ts-expect-error cause error
		) = cast("" as string & DString.MaxCharacters<100>);

		const value5: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		) = cast(
			"" as string & DString.MinCharacters<10> & CastError<
				"Impossible to cast on MaxCharacters because value does not have MaxCharacters constraint.",
				string & DString.MinCharacters<10>,
				DString.MaxCharacters<50>
			>,
		);

		const value55: (
			| (number & DNumber.LessThanOrEqual<12>)
			| (string & DString.MaxCharacters<50>)
		// @ts-expect-error cause error
		) = cast("" as string & DString.MinCharacters<10>);

		const value6: string & DString.MaxCharacters<50> = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<30>)
			),
		);

		const value7: string & DString.MaxCharacters<50> = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<60>)
			) & CastError<
				"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<60> from the value is more than.",
				string & DString.MaxCharacters<60>,
				DString.MaxCharacters<50>
			>,
		);
		const value75: string & DString.MaxCharacters<50> = cast(
			// @ts-expect-error cause error
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<60>)
			),
		);

		const value8: (
			| (string & DString.MaxCharacters<50>)
			| (string & DString.NotEmpty)
		) = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MinCharacters<20>)
			),
		);

		const value9: (
			| (string & DString.MaxCharacters<50>)
			| (string & DString.NotEmpty)
		) = cast(
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<100>)
			)
			& (
				| CastError<
					"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<100> from the value is more than.",
					string & DString.MaxCharacters<100>,
					DString.MaxCharacters<50>
				>
				| & CastError<
					"Impossible to cast on MinCharacters because value does not have MinCharacters constraint.",
					string & DString.MaxCharacters<100>,
					DString.NotEmpty
				>
			),
		);
		const value95: (
			| (string & DString.MaxCharacters<50>)
			| (string & DString.NotEmpty)
		) = cast(
			// @ts-expect-error cause error
			"" as (
				| (string & DString.MaxCharacters<20>)
				| (string & DString.MaxCharacters<100>)
			),
		);

		const value10: (
			| (string & DString.MaxCharacters<50> & DString.NotEmpty)
			| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
			| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			"" as (
				| (string & DString.NotEmpty & DString.MaxCharacters<20>)
				| (number & DNumber.GreaterThan<20> & DNumber.LessThan<90>)
			),
		);

		const value11: (
			| (string & DString.MaxCharacters<50> & DString.NotEmpty)
			| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
			| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			"" as unknown as (
				| (string & DString.NotEmpty & DString.MaxCharacters<60>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThan<90>)
			)
			& (
				| CastError<
					"Impossible to cast on MaxCharacters<50> because constraint MaxCharacters<60> from the value is more than.",
					string & DString.NotEmpty & DString.MaxCharacters<60>,
					DString.MaxCharacters<50>
				>
				| CastError<
					"Impossible to cast on GreaterThan<10> because constraint GreaterThan<1> from the value is less than.",
					number & DNumber.GreaterThan<1> & DNumber.LessThan<90>,
					DNumber.GreaterThan<10>
				>
			),
		);
		const value115: (
				| (string & DString.MaxCharacters<50> & DString.NotEmpty)
				| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
				| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			// @ts-expect-error cause error
			"" as (
				| (string & DString.NotEmpty & DString.MaxCharacters<60>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThan<90>)
			),
		);

		const value12: (
				| (string & DString.MaxCharacters<50> & DString.NotEmpty)
				| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
				| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			"" as string & DString.NotEmpty & DString.MaxCharacters<60> & DString.LengthEqual<20>,
		);

		const value13: (
				| (string & DString.MaxCharacters<50> & DString.NotEmpty)
				| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
				| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			1 as number & DNumber.GreaterThan<1> & DNumber.GreaterThanOrEqual<20> & DNumber.LessThan<90>,
		);

		const value14: (
			| (string & DString.MaxCharacters<50> & DString.NotEmpty)
			| (number & DNumber.GreaterThan<10> & DNumber.LessThan<100>)
			| (readonly unknown[] & DArray.MinElements<1> & DArray.MaxElements<10>)
		) = cast(
			[] as unknown as (
				& readonly unknown[]
				& DArray.MinElements<0>
				& DArray.MaxElements<20>
				& DArray.LengthEqual<5>
			),
		);
	});

	it("does not combine constraints from different expected union branches", () => {
		type Expected =
			| (string & DString.Email & DString.MaxCharacters<10>)
			| (string & DString.Url & DString.MinCharacters<5>);

		const input = "value" as string & DString.Email & DString.MinCharacters<5>;

		// @ts-expect-error the input satisfies neither complete expected union branch.
		const value: Expected = cast(input);
	});

	it("cast value", () => {
		const value1: 1 | 2 | 3 = cast(1 as 1 | 2);

		const value2: number = cast(
			"" as "test" & CastError<
				"Input value are not Extends",
				"test",
				number
			>,
		);
		// @ts-expect-error cause error
		const value25: number = cast("" as "test");

		const value3: readonly ["test", 1, "test"] = cast(
			[] as unknown as readonly (string | number)[] & DArray.LengthEqual<3> & CastError<
				"Input value are not Extends",
				[string | number, string | number, string | number],
				readonly ["test", 1, "test"]
			>,
		);
		const value35: readonly ["test", 1, "test"] = cast(
			// @ts-expect-error cause error
			[] as unknown as readonly (string | number)[] & DArray.LengthEqual<3>,
		);
	});

	it("rejects incompatible values outside supported constraint domains", () => {
		// @ts-expect-error boolean is not assignable to string.
		const value1: string = cast(true);
		// @ts-expect-error objects have incompatible structures.
		const value2: { name: string } = cast({ id: 1 });

		const input = "value" as string | boolean;

		// @ts-expect-error every input union member must be assignable to string.
		const value3: string = cast(input);
	});

	it("shameOnYou bypasses expected constraints while preserving the raw input contract", () => {
		const value1 = shameOnYou<string & DString.MinCharacters<10>>("short");
		const value2 = shameOnYou<
			string & DString.MinCharacters<10> & DString.MaxCharacters<3>
		>("value");
		const value3 = shameOnYou<number & DNumber.GreaterThan<100>>(42);
		const value4 = shameOnYou<
			readonly unknown[] & DArray.MinElements<3>
		>([]);

		type _CheckValue1 = ExpectType<
			typeof value1,
			string & DString.MinCharacters<10>,
			"strict"
		>;
		type _CheckValue2 = ExpectType<
			typeof value2,
			string & DString.MinCharacters<10> & DString.MaxCharacters<3>,
			"strict"
		>;
		type _CheckValue3 = ExpectType<
			typeof value3,
			number & DNumber.GreaterThan<100>,
			"strict"
		>;
		type _CheckValue4 = ExpectType<
			typeof value4,
			readonly unknown[] & DArray.MinElements<3>,
			"strict"
		>;

		// @ts-expect-error the input must still match the expected raw value.
		shameOnYou<string & DString.MinCharacters<10>>(42);
		// @ts-expect-error the input must still match the expected raw tuple shape.
		shameOnYou<readonly [string, number]>(["value"]);

		expect(value1).toBe("short");
		expect(value2).toBe("value");
		expect(value3).toBe(42);
		expect(value4).toEqual([]);
	});
});
