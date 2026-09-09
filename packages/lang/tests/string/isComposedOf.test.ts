import { type DCommon, DString, pipe, when, type ExpectType } from "@scripts";

describe("isComposedOf", () => {
	it("should validate characters from one range", () => {
		expect(DString.isComposedOf("azerty", "a-z")).toBe(true);
		expect(DString.isComposedOf("Azerty", "a-z")).toBe(false);
	});

	it("should validate characters from multiple ranges", () => {
		expect(DString.isComposedOf("abc123", ["a-z", "0-9"])).toBe(true);
		expect(DString.isComposedOf("abc-123", ["a-z", "0-9"])).toBe(false);
	});

	it("should narrow a string with a single range predicate outside pipe", () => {
		const source = "abc" as string;

		if (DString.isComposedOf(source, "a-z")) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.AllowedCharacters<"a-z">,
				"strict"
			>;
		}
	});

	it("should narrow a constrained string with a single range predicate outside pipe", () => {
		const source = "abc123" as | (string & DString.AllowedCharacters<"a-z">)
			| (string & DString.AllowedCharacters<"a-z" | "0-9">)
			| (string & DString.AllowedCharacters<"0-9">);

		if (DString.isComposedOf(source, "0-9")) {
			type _CheckSource = ExpectType<
				typeof source,
				(
					string & DString.AllowedCharacters<"0-9">
				),
				"strict"
			>;
		}
	});

	it("should narrow a string with multiple range predicate outside pipe", () => {
		const source = "abc123" as string;
		const predicate = DString.isComposedOf(["a-z", "0-9"]);

		if (predicate(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.AllowedCharacters<"a-z" | "0-9">,
				"strict"
			>;
		}
	});

	it("should use a single range predicate in pipe with when", () => {
		const result = pipe(
			"abc" as string,
			when(
				DString.isComposedOf("a-z"),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string & DString.AllowedCharacters<"a-z">,
						"strict"
					>;

					return "lowercase";
				},
			),
		);

		expect(result).toBe("lowercase");
	});

	it("should use a multiple range predicate in pipe with when", () => {
		const result = pipe(
			"ABC123" as "ABC123" | "abc123",
			when(
				DString.isComposedOf(["A-Z", "0-9"]),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string & DString.AllowedCharacters<"0-9" | "A-Z">,
						"strict"
					>;

					return "uppercase-code";
				},
			),
		);

		expect(result).toBe("uppercase-code");
	});

	it("should accept a more restrictive allowed characters constraint", () => {
		type _CheckConstraint = ExpectType<
			DCommon.IsExtends<
				DString.AllowedCharacters<"a-z">,
				DString.AllowedCharacters<"a-z" | "0-9">
			>,
			true,
			"strict"
		>;
	});

	it("should accept an equal allowed characters constraint", () => {
		type _CheckConstraint = ExpectType<
			DCommon.IsExtends<
				DString.AllowedCharacters<"a-z" | "0-9">,
				DString.AllowedCharacters<"a-z" | "0-9">
			>,
			true,
			"strict"
		>;
	});

	it("should reject a broader allowed characters constraint", () => {
		type _CheckConstraint = ExpectType<
			DCommon.IsExtends<
				DString.AllowedCharacters<"a-z" | "A-Z" | "0-9">,
				DString.AllowedCharacters<"a-z" | "0-9">
			>,
			false,
			"strict"
		>;
	});

	it("should reject a partially outside allowed characters constraint", () => {
		type _CheckConstraint = ExpectType<
			DCommon.IsExtends<
				DString.AllowedCharacters<"A-Z" | "0-9">,
				DString.AllowedCharacters<"a-z" | "0-9">
			>,
			false,
			"strict"
		>;
	});

	it("should reject a fully outside allowed characters constraint", () => {
		type _CheckConstraint = ExpectType<
			DCommon.IsExtends<
				DString.AllowedCharacters<"A-Z">,
				DString.AllowedCharacters<"a-z" | "0-9">
			>,
			false,
			"strict"
		>;
	});
});
