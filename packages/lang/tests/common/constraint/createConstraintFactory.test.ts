import type * as DArray from "@scripts/array";
import * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type * as DPath from "@scripts/path";
import type * as DString from "@scripts/string";

describe("createConstraintFactory", () => {
	it("infers literal strings and adds the fixed target constraints", () => {
		type ShortName = string & DString.MinCharacters<3> & DString.MaxCharacters<8>;
		const createName = DCommon.createConstraintFactory<ShortName>();
		const result = createName("hello");

		expect(result).toBe("hello");

		type _CheckResult = DCommon.ExpectType<typeof result, "hello" & ShortName, "strict">;

		// @ts-expect-error the literal is too short.
		createName("hi");
		// @ts-expect-error the literal is too long.
		createName("hello world");
		// @ts-expect-error a broad string does not prove the required bounds.
		createName("hello" as string);
		// @ts-expect-error the primordial input type is string.
		createName(123);
	});

	it("retains existing constraints when they imply the target", () => {
		type Email = string & DString.Email & DString.MaxCharacters<250>;
		const createEmail = DCommon.createConstraintFactory<Email>();
		const input = "contact@example.com" as string & DString.Email & DString.MaxCharacters<200>;
		const result = createEmail(input);

		expect(result).toBe(input);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input & Email, "strict">;

		// @ts-expect-error the input does not carry an Email proof.
		createEmail("contact@example.com");
		// @ts-expect-error the existing upper bound is too large.
		createEmail("contact@example.com" as string & DString.Email & DString.MaxCharacters<300>);
	});

	it("infers numeric literals and applies numeric compatibility rules", () => {
		type Score = number & DNumber.GreaterThanOrEqual<0> & DNumber.LessThanOrEqual<100>;
		const createScore = DCommon.createConstraintFactory<Score>();
		const result = createScore(42);

		expect(result).toBe(42);

		type _CheckResult = DCommon.ExpectType<typeof result, 42 & Score, "strict">;

		// @ts-expect-error the literal is below the lower bound.
		createScore(-1);
		// @ts-expect-error the literal is above the upper bound.
		createScore(101);
		// @ts-expect-error a broad number does not prove the required bounds.
		createScore(42 as number);
	});

	it("infers readonly tuples and preserves the array reference", () => {
		type Pair = readonly number[] & DArray.LengthEqual<2>;
		const createPair = DCommon.createConstraintFactory<Pair>();
		const input = [1, 2] as const;
		const result = createPair(input);
		const literalResult = createPair([3, 4]);

		expect(result).toBe(input);
		expect(literalResult).toStrictEqual([3, 4]);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input & Pair, "strict">;
		type _CheckLiteralResult = DCommon.ExpectType<typeof literalResult, readonly [3, 4] & Pair, "strict">;

		// @ts-expect-error the tuple has too few elements.
		createPair([1]);
		// @ts-expect-error the tuple has too many elements.
		createPair([1, 2, 3]);
		// @ts-expect-error the element type must match the target.
		createPair(["one", "two"]);
		// @ts-expect-error a broad array does not prove its length.
		createPair([1, 2] as number[]);
	});

	it("declares absolute paths from literals or existing proofs", () => {
		type AbsolutePath = string & DPath.Absolute & DPath.Path;
		const declareAbsolutePath = DCommon.createConstraintFactory<AbsolutePath>();
		const result = declareAbsolutePath("/folder/file.txt");
		const input = "/folder/file.txt" as AbsolutePath;
		const provenResult = declareAbsolutePath(input);

		expect(result).toBe("/folder/file.txt");
		expect(provenResult).toBe(input);

		type _CheckResult = DCommon.ExpectType<typeof result, "/folder/file.txt" & AbsolutePath, "strict">;
		type _CheckProvenResult = DCommon.ExpectType<typeof provenResult, AbsolutePath, "strict">;

		// @ts-expect-error a relative path does not prove Absolute.
		declareAbsolutePath("folder/file.txt");
		// @ts-expect-error dot segments are not normalized.
		declareAbsolutePath("/folder/./file.txt");
		// @ts-expect-error null bytes are forbidden in paths.
		declareAbsolutePath("/folder\0/file.txt");
		// @ts-expect-error a broad string does not prove Absolute or Path.
		declareAbsolutePath("/folder/file.txt" as string);
	});

	it("requires custom constraints without inventing a proof", () => {
		type Verified = string & DCommon.Constraint<"verified">;
		const createVerified = DCommon.createConstraintFactory<Verified>();
		const input = "value" as Verified;
		const result = createVerified(input);

		expect(result).toBe(input);

		type _CheckResult = DCommon.ExpectType<typeof result, Verified, "strict">;

		// @ts-expect-error an arbitrary literal cannot establish a custom constraint.
		createVerified("value");
	});

	it("keeps the target fixed when used in a pipe", () => {
		type ShortName = string & DString.MinCharacters<3>;
		const createName = DCommon.createConstraintFactory<ShortName>();
		const result = DCommon.pipe("hello" as const, createName);

		expect(result).toBe("hello");

		type _CheckResult = DCommon.ExpectType<typeof result, "hello" & ShortName, "strict">;

		// @ts-expect-error the contextual result cannot replace the fixed target.
		const invalidResult: number = createName("hello");
	});

	it("checks every input union member against complete target branches", () => {
		type Target = (string & DString.MinCharacters<3>) | (number & DNumber.GreaterThan<0>);
		const createValue = DCommon.createConstraintFactory<Target>();
		const input = "hello" as "hello" | 42;
		const result = createValue(input);

		expect(result).toBe(input);

		type _CheckResult = DCommon.ExpectType<typeof result, typeof input & Target, "strict">;

		// @ts-expect-error one union member fails the target constraint.
		createValue("hello" as "hello" | -1);

		type Branches =
			| (string & DString.MinCharacters<3> & DString.MaxCharacters<5>)
			| (string & DString.MinCharacters<8> & DString.MaxCharacters<10>);
		const createBranch = DCommon.createConstraintFactory<Branches>();

		// @ts-expect-error a value must satisfy one entire target branch.
		createBranch("middle");
	});
});
