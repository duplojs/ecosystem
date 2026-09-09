import { DCommon, type DArray, type DNumber, type DPath, type DString, type ExpectType } from "@scripts";

describe("infer", () => {
	describe("string", () => {
		it("inference without constraint", () => {
			const result: "hello" = DCommon.infer("hello");

			expect(result).toBe("hello");
		});

		it("correct infer generic constraint", () => {
			function testInference<
				RR extends { wrap: string & DString.MinCharacters<5> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer("hello") });

			type _CheckResult = ExpectType<
				typeof result,
				& "hello"
				& DString.MinCharacters<5>,
				"strict"
			>;
		});

		it("correct infer generic constraint on literal", () => {
			function testInference<
				RR extends { wrap: ("hello" | "world") & DString.MinCharacters<5> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer("hello") });

			type _CheckResult = ExpectType<
				typeof result,
				& "hello"
				& DString.LengthEqual<5>
				& DString.MaxCharacters<5>
				& DString.MinCharacters<5>,
				"strict"
			>;
		});

		it("correct infer LengthEqual constraint from literal", () => {
			const result: string & DString.LengthEqual<5> = DCommon.infer("hello");
		});

		it("correct infer MinCharacters constraint from literal", () => {
			const result: string & DString.MinCharacters<3> = DCommon.infer("hello");
		});

		it("correct infer MaxCharacters constraint from literal", () => {
			const result: string & DString.MaxCharacters<8> = DCommon.infer("hello");
		});

		it("correct infer all compatible constraints from literal", () => {
			const result:
				& string
				& DString.LengthEqual<5>
				& DString.MinCharacters<3>
				& DString.MaxCharacters<8> = DCommon.infer("hello");
		});

		it("correct infer all exact constraints from literal", () => {
			const result:
				& string
				& DString.LengthEqual<5>
				& DString.MinCharacters<5>
				& DString.MaxCharacters<5> = DCommon.infer("hello");
		});

		it("correct infer AllowedCharacters constraint from literal", () => {
			const result: string & DString.AllowedCharacters<"a-z"> = DCommon.infer("hello");

			expect(result).toBe("hello");
		});

		it("correct infer AllowedCharacters constraint with multiple ranges from literal", () => {
			const result: string & DString.AllowedCharacters<"a-z" | "0-9" | "A-Z"> = DCommon.infer("hello123");

			expect(result).toBe("hello123");
		});

		it("correct infer compatible AllowedCharacters branch from output union", () => {
			function testInference<
				GenericResult extends {
					wrap:
						| (string & DString.AllowedCharacters<"a-z">)
						| (string & DString.AllowedCharacters<"0-9">);
				},
			>(
				arg: GenericResult,
			): GenericResult["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer("hello") });

			type _CheckResult = ExpectType<
				typeof result,
				"hello" & DString.AllowedCharacters<"a-z">,
				"strict"
			>;
		});

		it("correct infer Number constraint from number literal", () => {
			const result: string & DString.Number = DCommon.infer("12.5");

			expect(result).toBe("12.5");
		});

		it("correct infer Path constraint from literal", () => {
			const result: string & DPath.Path = DCommon.infer("alpha/beta");

			expect(result).toBe("alpha/beta");
		});

		it("correct infer Absolute constraint from literal", () => {
			const result: string & DPath.Absolute = DCommon.infer("/alpha/beta");

			expect(result).toBe("/alpha/beta");
		});

		it("correct infer Segment constraint from literal", () => {
			const result: string & DPath.Segment = DCommon.infer("alpha");

			expect(result).toBe("alpha");
		});

		it("correct infer generic literal through function argument", () => {
			function testInference<
				const GenericInput extends string,
				RR extends {
					wrap:
						& GenericInput
						& DString.MinCharacters<3>
						& DString.MaxCharacters<8>;
				},
			>(
				input: GenericInput,
				arg: RR,
			): RR["wrap"] {
				expect(arg.wrap).toBe(input);
				return arg.wrap;
			}
			const result = testInference(
				"hello",
				{ wrap: DCommon.infer("hello") },
			);

			type _CheckResult = ExpectType<
				typeof result,
				"hello"
				& DString.LengthEqual<5>
				& DString.MaxCharacters<5>
				& DString.MinCharacters<3>
				& DString.MinCharacters<5>
				& DString.MaxCharacters<8>,
				"strict"
			>;
		});

		it("correct infer compatible branch from output union", () => {
			function testInference<
				RR extends {
					wrap:
						| (string & DString.MinCharacters<3>)
						| (string & DString.MaxCharacters<3>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer("hello") });

			type _CheckResult = ExpectType<
				typeof result,
				& "hello"
				& DString.MinCharacters<3>,
				"strict"
			>;
		});

		it("correct infer compatible literal branch from output union", () => {
			function testInference<
				RR extends {
					wrap:
						| ("hello" & DString.MinCharacters<5>)
						| ("world" & DString.MaxCharacters<3>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer("hello") });

			type _CheckResult = ExpectType<
				typeof result,
				& "hello"
				& DString.LengthEqual<5>
				& DString.MaxCharacters<5>
				& DString.MinCharacters<5>,
				"strict"
			>;
		});

		it("correct infer constraint from input union", () => {
			function testInference<
				RR extends { wrap: string & DString.MinCharacters<5> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = "hello" as "hello" | "world";
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| ("hello" & DString.MinCharacters<5>)
				| ("world" & DString.MinCharacters<5>),
				"strict"
			>;
		});

		it("correct infer compatible branches from input and output unions", () => {
			function testInference<
				RR extends {
					wrap:
						| (string & DString.MinCharacters<5>)
						| (string & DString.MaxCharacters<4>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = "hi" as "hi" | "hello";
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| ("hi" & DString.MaxCharacters<4>)
				| ("hello" & DString.MinCharacters<5>),
				"strict"
			>;
		});

		it("should reject incompatible MaxCharacters constraints", () => {
			const result: string & DString.MaxCharacters<3> = DCommon.infer(
			// @ts-expect-error MaxCharacters<5> from the value does not induce MaxCharacters<3>.
				"hello",
			);
		});

		it("should reject incompatible MinCharacters constraints", () => {
			const result: string & DString.MinCharacters<8> = DCommon.infer(
			// @ts-expect-error MinCharacters<5> from the value does not induce MinCharacters<8>.
				"hello",
			);
		});

		it("should reject incompatible LengthEqual constraints", () => {
			const result: string & DString.LengthEqual<3> = DCommon.infer(
			// @ts-expect-error LengthEqual<5> from the value does not induce LengthEqual<3>.
				"hello",
			);
		});

		it("should reject incompatible AllowedCharacters constraint", () => {
			const result: string & DString.AllowedCharacters<"a-z"> = DCommon.infer(
			// @ts-expect-error a literal containing a digit does not induce AllowedCharacters<"a-z">.
				"hello1",
			);
		});

		it("should reject constraints that cannot be inferred from a literal", () => {
			// @ts-expect-error infer cannot prove the Email constraint.
			const email: string & DString.Email = DCommon.infer(
				"contact@example.com",
			);
			// @ts-expect-error an inferred MaxCharacters constraint cannot hide the missing Email proof.
			const emailWithMaxCharacters: string & DString.Email & DString.MaxCharacters<30> = DCommon.infer(
				"contact@example.com",
			);
			// @ts-expect-error infer cannot prove the Trimmed constraint.
			const trimmed: string & DString.Trimmed = DCommon.infer(
				"hello",
			);
		});

		it("should reject incompatible Number constraint", () => {
			const result: string & DString.Number = DCommon.infer(
			// @ts-expect-error a non-number literal does not induce Number.
				"hello",
			);
		});

		it("should reject incompatible Path constraints", () => {
			const result: string & DPath.Path = DCommon.infer(
			// @ts-expect-error double separators are not valid path segments.
				"alpha//beta",
			);
		});

		it("should reject incompatible Absolute constraints", () => {
			const result: string & DPath.Absolute = DCommon.infer(
			// @ts-expect-error relative paths do not induce Absolute.
				"alpha/beta",
			);
		});

		it("should reject incompatible Segment constraints", () => {
			const result: string & DPath.Segment = DCommon.infer(
			// @ts-expect-error paths with separators do not induce Segment.
				"alpha/beta",
			);
		});

		it("should reject non literal input", () => {
			const source = "hello" as string;

			DCommon.infer(
			// @ts-expect-error infer requires a literal string input.
				source,
			);
		});

		it("should reject constrained string input", () => {
			const source = "hello" as unknown as string & DString.LengthEqual<5>;

			DCommon.infer(
			// @ts-expect-error infer only derives constraints from literal strings.
				source,
			);
		});

		it("should reject output union without compatible branch", () => {
			function testInference<
				RR extends {
					wrap:
						| (string & DString.MinCharacters<8>)
						| (string & DString.MaxCharacters<3>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}

			testInference({
				wrap: DCommon.infer(
					// @ts-expect-error no output union branch is induced by the literal.
					"hello",
				),
			});
		});

		it("should reject input union with an incompatible string member", () => {
			const source = "hi" as "hi" | "hello";

			const result: string & DString.MinCharacters<5> = DCommon.infer(
				// @ts-expect-error every input union member must induce MinCharacters<5>.
				source,
			);
		});
	});

	describe("number", () => {
		it("inference without constraint", () => {
			const result: 3 = DCommon.infer(3);

			expect(result).toBe(3);
		});

		it("correct infer generic constraint", () => {
			function testInference<
				RR extends { wrap: number & DNumber.GreaterThan<2> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(3) });

			type _CheckResult = ExpectType<
				typeof result,
				& 3
				& DNumber.GreaterThan<2>,
				"strict"
			>;
		});

		it("correct infer generic constraint on literal", () => {
			function testInference<
				RR extends { wrap: (3 | 4) & DNumber.GreaterThan<2> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(3) });

			type _CheckResult = ExpectType<
				typeof result,
				& 3
				& DNumber.GreaterThan<2>
				& DNumber.GreaterThanOrEqual<3>
				& DNumber.LessThanOrEqual<3>,
				"strict"
			>;
		});

		it("correct infer GreaterThan constraint from literal", () => {
			const result: number & DNumber.GreaterThan<2> = DCommon.infer(3);
		});

		it("correct infer GreaterThanOrEqual constraint from literal", () => {
			const result: number & DNumber.GreaterThanOrEqual<3> = DCommon.infer(3);
		});

		it("correct infer LessThan constraint from literal", () => {
			const result: number & DNumber.LessThan<4> = DCommon.infer(3);
		});

		it("correct infer LessThanOrEqual constraint from literal", () => {
			const result: number & DNumber.LessThanOrEqual<3> = DCommon.infer(3);
		});

		it("correct infer Positive constraint from literal", () => {
			const result: number & DNumber.Positive = DCommon.infer(0);
		});

		it("correct infer Negative constraint from literal", () => {
			const result: number & DNumber.Negative = DCommon.infer(0);
		});

		it("correct infer StrictPositive constraint from literal", () => {
			const result: number & DNumber.StrictPositive = DCommon.infer(1);
		});

		it("correct infer StrictNegative constraint from literal", () => {
			const result: number & DNumber.StrictNegative = DCommon.infer(-1);
		});

		it("correct infer Integer constraint from literal", () => {
			const result: number & DNumber.Integer = DCommon.infer(3);
		});

		it("correct infer Int constraint from literal", () => {
			const result: number & DNumber.Int = DCommon.infer(3);
		});

		it("correct infer NotZero constraint from literal", () => {
			const result: number & DNumber.NotZero = DCommon.infer(-1);
		});

		it("correct infer Safe constraint from literal", () => {
			const result: number & DNumber.Safe = DCommon.infer(1.5);
		});

		it("correct infer all compatible constraints from literal", () => {
			const result:
				& number
				& DNumber.GreaterThan<2>
				& DNumber.GreaterThanOrEqual<3>
				& DNumber.LessThan<4>
				& DNumber.LessThanOrEqual<3>
				& DNumber.Integer
				& DNumber.NotZero
				& DNumber.Safe = DCommon.infer(3);
		});

		it("correct infer all exact constraints from literal", () => {
			const result:
				& number
				& DNumber.GreaterThanOrEqual<3>
				& DNumber.LessThanOrEqual<3>
				& DNumber.Integer
				& DNumber.NotZero
				& DNumber.Safe = DCommon.infer(3);
		});

		it("correct infer generic literal through function argument", () => {
			function testInference<
				const GenericInput extends number,
				RR extends {
					wrap:
						& GenericInput
						& DNumber.GreaterThan<2>
						& DNumber.LessThan<8>
						& DNumber.Integer
						& DNumber.NotZero
						& DNumber.Safe;
				},
			>(
				input: GenericInput,
				arg: RR,
			): RR["wrap"] {
				expect(arg.wrap).toBe(input);
				return arg.wrap;
			}
			const result = testInference(
				3,
				{ wrap: DCommon.infer(3) },
			);

			type _CheckResult = ExpectType<
				typeof result,
				& 3
				& DNumber.GreaterThan<2>
				& DNumber.GreaterThanOrEqual<3>
				& DNumber.LessThan<8>
				& DNumber.LessThanOrEqual<3>
				& DNumber.Integer
				& DNumber.NotZero
				& DNumber.Safe,
				"strict"
			>;
		});

		it("correct infer compatible branch from output union", () => {
			function testInference<
				RR extends {
					wrap:
						| (number & DNumber.GreaterThan<0>)
						| (number & DNumber.LessThan<0>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(1) });

			type _CheckResult = ExpectType<
				typeof result,
				& 1
				& DNumber.GreaterThan<0>,
				"strict"
			>;
		});

		it("correct infer compatible literal branch from output union", () => {
			function testInference<
				RR extends {
					wrap:
						| (1 & DNumber.GreaterThan<0>)
						| (2 & DNumber.LessThan<3>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(1) });

			type _CheckResult = ExpectType<
				typeof result,
				& 1
				& DNumber.GreaterThan<0>
				& DNumber.GreaterThanOrEqual<1>
				& DNumber.LessThanOrEqual<1>,
				"strict"
			>;
		});

		it("correct infer constraint from input union", () => {
			function testInference<
				RR extends { wrap: number & DNumber.GreaterThan<2> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = 3 as 3 | 4;
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| (3 & DNumber.GreaterThan<2>)
				| (4 & DNumber.GreaterThan<2>),
				"strict"
			>;
		});

		it("correct infer compatible branches from input and output unions", () => {
			function testInference<
				RR extends {
					wrap:
						| (number & DNumber.GreaterThan<0>)
						| (number & DNumber.LessThan<0>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = 1 as -1 | 1;
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| (-1 & DNumber.LessThan<0>)
				| (1 & DNumber.GreaterThan<0>),
				"strict"
			>;
		});

		it("should reject incompatible GreaterThan constraints", () => {
			const result: number & DNumber.GreaterThan<3> = DCommon.infer(
			// @ts-expect-error GreaterThanOrEqual<3> from the value does not induce GreaterThan<3>.
				3,
			);
		});

		it("should reject incompatible GreaterThanOrEqual constraints", () => {
			const result: number & DNumber.GreaterThanOrEqual<4> = DCommon.infer(
			// @ts-expect-error GreaterThanOrEqual<3> from the value does not induce GreaterThanOrEqual<4>.
				3,
			);
		});

		it("should reject incompatible LessThan constraints", () => {
			const result: number & DNumber.LessThan<3> = DCommon.infer(
			// @ts-expect-error LessThanOrEqual<3> from the value does not induce LessThan<3>.
				3,
			);
		});

		it("should reject incompatible LessThanOrEqual constraints", () => {
			const result: number & DNumber.LessThanOrEqual<2> = DCommon.infer(
			// @ts-expect-error LessThanOrEqual<3> from the value does not induce LessThanOrEqual<2>.
				3,
			);
		});

		it("should reject incompatible Positive constraints", () => {
			const result: number & DNumber.Positive = DCommon.infer(
			// @ts-expect-error GreaterThanOrEqual<-1> from the value does not induce Positive.
				-1,
			);
		});

		it("should reject incompatible Negative constraints", () => {
			const result: number & DNumber.Negative = DCommon.infer(
			// @ts-expect-error LessThanOrEqual<1> from the value does not induce Negative.
				1,
			);
		});

		it("should reject incompatible StrictPositive constraints", () => {
			const result: number & DNumber.StrictPositive = DCommon.infer(
			// @ts-expect-error GreaterThanOrEqual<0> from the value does not induce StrictPositive.
				0,
			);
		});

		it("should reject incompatible StrictNegative constraints", () => {
			const result: number & DNumber.StrictNegative = DCommon.infer(
			// @ts-expect-error LessThanOrEqual<0> from the value does not induce StrictNegative.
				0,
			);
		});

		it("should reject incompatible Integer constraints", () => {
			const result: number & DNumber.Integer = DCommon.infer(
			// @ts-expect-error infer cannot derive Integer from a decimal literal.
				3.5,
			);
		});

		it("should reject incompatible NotZero constraints", () => {
			const result: number & DNumber.NotZero = DCommon.infer(
			// @ts-expect-error infer cannot derive NotZero from zero.
				0,
			);
		});

		it("should reject incompatible Safe max boundary", () => {
			const result: number & DNumber.Safe = DCommon.infer(
			// @ts-expect-error infer cannot derive Safe from the excluded max safe boundary.
				9007199254740992,
			);
		});

		it("should reject incompatible Safe min boundary", () => {
			const result: number & DNumber.Safe = DCommon.infer(
			// @ts-expect-error infer cannot derive Safe from the excluded min safe boundary.
				-9007199254740992,
			);
		});

		it("should reject non literal input", () => {
			const source = 3 as number;

			DCommon.infer(
			// @ts-expect-error infer requires a literal number input.
				source,
			);
		});

		it("should reject constrained number input", () => {
			const source = 3 as unknown as number & DNumber.Integer;

			DCommon.infer(
			// @ts-expect-error infer only derives constraints from literal numbers.
				source,
			);
		});

		it("should reject output union without compatible branch", () => {
			function testInference<
				RR extends {
					wrap:
						| (number & DNumber.GreaterThan<2>)
						| (number & DNumber.LessThan<0>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}

			testInference({
				wrap: DCommon.infer(
					// @ts-expect-error no output union branch is induced by the literal.
					1,
				),
			});
		});

		it("should reject input union with an incompatible number member", () => {
			const source = 13 as 11 | 13;

			const result: number & DNumber.GreaterThan<12> = DCommon.infer(
				// @ts-expect-error every input union member must induce GreaterThan<12>.
				source,
			);
		});
	});

	describe("array", () => {
		it("inference without constraint", () => {
			const result: readonly ("a" | "b")[] = DCommon.infer(["a", "b"]);

			expect(result).toStrictEqual(["a", "b"]);
		});

		it("correct infer generic constraint", () => {
			function testInference<
				RR extends { wrap: readonly ("a" | "b")[] & DArray.MinElements<2> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(["a", "b"]) });

			type _CheckResult = ExpectType<
				typeof result,
				readonly ["a", "b"] & DArray.MinElements<2>,
				"strict"
			>;
		});

		it("correct infer generic constraint on tuple", () => {
			function testInference<
				RR extends { wrap: readonly ["a" | "A", "b" | "B"] & DArray.MinElements<2> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(["a", "B"]) });

			type _CheckResult = ExpectType<
				typeof result,
				& readonly ["a", "B"]
				& DArray.LengthEqual<2>
				& DArray.MaxElements<2>
				& DArray.MinElements<2>,
				"strict"
			>;
		});

		it("correct infer LengthEqual constraint from tuple", () => {
			const result: readonly string[] & DArray.LengthEqual<3> = DCommon.infer(
				["a", "b", "c"],
			);
		});

		it("correct infer MinElements constraint from tuple", () => {
			const result: readonly string[] & DArray.MinElements<2> = DCommon.infer(
				["a", "b", "c"],
			);
		});

		it("correct infer MaxElements constraint from tuple", () => {
			const result: readonly string[] & DArray.MaxElements<5> = DCommon.infer(
				["a", "b", "c"],
			);
		});

		it("correct infer all compatible constraints from tuple", () => {
			const result:
				& readonly string[]
				& DArray.LengthEqual<3>
				& DArray.MinElements<2>
				& DArray.MaxElements<5> = DCommon.infer(
					["a", "b", "c"],
				);
		});

		it("correct infer all exact constraints from tuple", () => {
			const result:
				& readonly string[]
				& DArray.LengthEqual<3>
				& DArray.MinElements<3>
				& DArray.MaxElements<3> = DCommon.infer(
					["a", "b", "c"],
				);
		});

		it("correct infer generic tuple through function argument", () => {
			function testInference<
				const GenericInput extends readonly string[],
				RR extends {
					wrap:
						& GenericInput
						& DArray.MinElements<2>
						& DArray.MaxElements<5>;
				},
			>(
				input: GenericInput,
				arg: RR,
			): RR["wrap"] {
				expect(arg.wrap).toStrictEqual(input);
				return arg.wrap;
			}
			const result = testInference(
				["a", "b", "c"],
				{ wrap: DCommon.infer(["a", "b", "c"]) },
			);

			type _CheckResult = ExpectType<
				typeof result,
				readonly ["a", "b", "c"]
				& DArray.LengthEqual<3>
				& DArray.MaxElements<3>
				& DArray.MinElements<2>
				& DArray.MinElements<3>
				& DArray.MaxElements<5>,
				"strict"
			>;
		});

		it("correct infer compatible branch from output union", () => {
			function testInference<
				RR extends {
					wrap:
						| (readonly string[] & DArray.MinElements<2>)
						| (readonly string[] & DArray.MaxElements<2>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(["a", "b", "c"]) });

			type _CheckResult = ExpectType<
				typeof result,
				& readonly ["a", "b", "c"]
				& DArray.MinElements<2>,
				"strict"
			>;
		});

		it("correct infer compatible tuple branch from output union", () => {
			function testInference<
				RR extends {
					wrap:
						| (readonly ["a", "b", "c"] & DArray.MinElements<2>)
						| (readonly ["a", "b"] & DArray.MaxElements<2>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const result = testInference({ wrap: DCommon.infer(["a", "b", "c"]) });

			type _CheckResult = ExpectType<
				typeof result,
				& readonly ["a", "b", "c"]
				& DArray.LengthEqual<3>
				& DArray.MaxElements<3>
				& DArray.MinElements<2>
				& DArray.MinElements<3>,
				"strict"
			>;
		});

		it("correct infer constraint from input union", () => {
			function testInference<
				RR extends { wrap: readonly string[] & DArray.MinElements<2> },
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = ["a", "b"] as
				| readonly ["a", "b"]
				| readonly ["a", "b", "c"];
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| (readonly ["a", "b"] & DArray.MinElements<2>)
				| (readonly ["a", "b", "c"] & DArray.MinElements<2>),
				"strict"
			>;
		});

		it("correct infer compatible branches from input and output unions", () => {
			function testInference<
				RR extends {
					wrap:
						| (readonly string[] & DArray.MinElements<3>)
						| (readonly string[] & DArray.MaxElements<1>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = ["a"] as
				| readonly ["a"]
				| readonly ["a", "b", "c"];
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| (readonly ["a"] & DArray.MaxElements<1>)
				| (readonly ["a", "b", "c"] & DArray.MinElements<3>),
				"strict"
			>;
		});

		it("should reject incompatible MaxElements constraints", () => {
			const result: readonly string[] & DArray.MaxElements<2> = DCommon.infer(
			// @ts-expect-error MaxElements<3> from the value does not induce MaxElements<2>.
				["a", "b", "c"],
			);
		});

		it("should reject incompatible MinElements constraints", () => {
			const result: readonly string[] & DArray.MinElements<4> = DCommon.infer(
			// @ts-expect-error MinElements<3> from the value does not induce MinElements<4>.
				["a", "b", "c"],
			);
		});

		it("should reject incompatible LengthEqual constraints", () => {
			const result: readonly string[] & DArray.LengthEqual<2> = DCommon.infer(
			// @ts-expect-error LengthEqual<3> from the value does not induce LengthEqual<2>.
				["a", "b", "c"],
			);
		});

		it("should reject LengthEqual declaration from input LengthEqual constraint", () => {
			const source = ["a", "b", "c"] as unknown as
				readonly string[] & DArray.LengthEqual<3>;
			DCommon.infer(
			// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
				source,
			);
		});

		it("should reject MinElements declaration from input LengthEqual constraint", () => {
			const source = ["a", "b", "c"] as unknown as
				readonly string[] & DArray.LengthEqual<3>;
			DCommon.infer(
			// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
				source,
			);
		});

		it("should reject MaxElements declaration from input LengthEqual constraint", () => {
			const source = ["a", "b", "c"] as unknown as
				readonly string[] & DArray.LengthEqual<3>;
			DCommon.infer(
			// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
				source,
			);
		});

		it("should reject MaxElements declaration from input MaxElements constraint", () => {
			const source = ["a", "b", "c"] as unknown as
				readonly string[] & DArray.MaxElements<5>;
			DCommon.infer(
			// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
				source,
			);
		});

		it("should reject MinElements declaration from input MinElements constraint", () => {
			const source = ["a", "b", "c"] as unknown as
				readonly string[] & DArray.MinElements<2>;
			DCommon.infer(
			// @ts-expect-error infer only derives constraints from tuples, not from constrained arrays.
				source,
			);
		});

		it("should reject output union without compatible branch", () => {
			function testInference<
				RR extends {
					wrap:
						| (readonly string[] & DArray.MinElements<4>)
						| (readonly string[] & DArray.MaxElements<2>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}

			testInference({
				wrap: DCommon.infer(
					// @ts-expect-error no output union branch is induced by the tuple.
					["a", "b", "c"],
				),
			});
		});

		it("should reject input union with an incompatible array member", () => {
			const source = ["a"] as
				| readonly ["a"]
				| readonly ["a", "b"];

			const result: readonly string[] & DArray.MinElements<2> = DCommon.infer(
				// @ts-expect-error every input union member must induce MinElements<2>.
				source,
			);
		});
	});

	describe("interdomain", () => {
		it("correct infer compatible string and number branches from input and output unions", () => {
			function testInference<
				RR extends {
					wrap:
						| (string & DString.MinCharacters<5>)
						| (number & DNumber.GreaterThan<12>);
				},
			>(
				arg: RR,
			): RR["wrap"] {
				return arg.wrap;
			}
			const source = "hello" as "hello" | 13;
			const result = testInference({ wrap: DCommon.infer(source) });

			type _CheckResult = ExpectType<
				typeof result,
				| ("hello" & DString.MinCharacters<5>)
				| (13 & DNumber.GreaterThan<12>),
				"strict"
			>;
		});

		it("should reject cross-domain input union with an incompatible number member", () => {
			const source = "hello" as "hello" | 11;

			DCommon.infer<
				| (string & DString.MinCharacters<5>)
				| (number & DNumber.GreaterThan<12>)
			>(
				// @ts-expect-error the number member does not induce GreaterThan<12>.
				source,
			);
		});

		it("works with a union value that has an unsupported value", () => {
			function testInference(arg?: number & DNumber.GreaterThan<12>) {}

			testInference(DCommon.infer(13));

			// @ts-expect-error the number member does not induce GreaterThan<12>.
			testInference(DCommon.infer(10));
		});
	});
});
