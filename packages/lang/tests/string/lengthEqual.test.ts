import { DString, pipe, when, type ExpectType } from "@scripts";

describe("lengthEqual", () => {
	it("should validate a string with the expected length", () => {
		const value = "code" as string;

		expect(DString.lengthEqual("code", 4)).toBe(true);
		expect(DString.lengthEqual(value, 5)).toBe(false);
	});

	it("should narrow the string inside a pipe when callback", () => {
		const source = "code" as string;
		const result = pipe(
			source,
			when(
				DString.lengthEqual(4),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string & DString.LengthEqual<4>,
						"strict"
					>;

					return value.length;
				},
			),
		);

		expect(result).toBe(4);
	});

	it("should narrow the string with a length equal constraint", () => {
		const source = "code" as string;

		if (DString.lengthEqual(source, 4)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.LengthEqual<4>,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});

	it("should discriminate compatible size constraints", () => {
		const source = "abc" as
			| (string & DString.LengthEqual<3>)
			| (string & DString.LengthEqual<5>)
			| (string & DString.MinCharacters<2>)
			| (string & DString.MaxCharacters<5>)
			| (string & DString.MinCharacters<5>)
			| (string & DString.MaxCharacters<2>);

		if (DString.lengthEqual(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.LengthEqual<3>)
				| (string & DString.MinCharacters<2> & DString.LengthEqual<3>)
				| (string & DString.MaxCharacters<5> & DString.LengthEqual<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.LengthEqual<5>)
				| (string & DString.MinCharacters<2>)
				| (string & DString.MaxCharacters<5>)
				| (string & DString.MinCharacters<5>)
				| (string & DString.MaxCharacters<2>),
				"strict"
			>;
		}
	});

	it("should reject incompatible length equal constraints", () => {
		const sourceLength = "hello" as string & DString.LengthEqual<5>;
		const sourceMin = "hello" as string & DString.MinCharacters<5>;
		const sourceMax = "hi" as string & DString.MaxCharacters<2>;
		const length = 3 as number;

		expect(DString.lengthEqual("abc", length)).toBe(true);

		// @ts-expect-error Cannot apply LengthEqual<3> on LengthEqual<5>.
		expect(DString.lengthEqual(sourceLength, 3)).toBe(false);

		// @ts-expect-error Cannot apply LengthEqual<3> on MinCharacters<5>.
		expect(DString.lengthEqual(sourceMin, 3)).toBe(false);

		// @ts-expect-error Cannot apply LengthEqual<3> on MaxCharacters<2>.
		expect(DString.lengthEqual(sourceMax, 3)).toBe(false);
	});
});
