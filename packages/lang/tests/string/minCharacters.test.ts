import { DString, pipe, when, type ExpectType } from "@scripts";

describe("minCharacters", () => {
	it("should validate a string longer than the minimum", () => {
		const short = "hi" as string;

		expect(DString.minCharacters("hello", 3)).toBe(true);
		expect(DString.minCharacters(short, 3)).toBe(false);
	});

	it("should narrow the string inside a pipe when callback", () => {
		const source = "hello" as string;
		const result = pipe(
			source,
			when(
				DString.minCharacters(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						string & DString.MinCharacters<3>,
						"strict"
					>;

					return value.length;
				},
			),
		);

		expect(result).toBe(5);
	});

	it("should narrow the string with a min characters constraint", () => {
		const source = "hello" as string;

		if (DString.minCharacters(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.MinCharacters<3>,
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
		const source = "hello" as
			| (string & DString.MinCharacters<2>)
			| (string & DString.MinCharacters<5>)
			| (string & DString.LengthEqual<4>)
			| (string & DString.MaxCharacters<2>)
			| (string & DString.MaxCharacters<5>);

		if (DString.minCharacters(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.MinCharacters<5>)
				| (string & DString.MinCharacters<2> & DString.MinCharacters<3>)
				| (string & DString.LengthEqual<4>)
				| (string & DString.MaxCharacters<5> & DString.MinCharacters<3>),
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				| (string & DString.MinCharacters<2>)
				| (string & DString.MaxCharacters<2>)
				| (string & DString.MaxCharacters<5>),
				"strict"
			>;
		}
	});

	it("should reject incompatible min characters constraints", () => {
		const sourceMax = "hi" as string & DString.MaxCharacters<2>;
		const sourceLength = "hi" as string & DString.LengthEqual<2>;
		const min = 3 as number;

		expect(DString.minCharacters("hello", min)).toBe(true);

		// @ts-expect-error Cannot apply MinCharacters<3> on MaxCharacters<2>.
		expect(DString.minCharacters(sourceMax, 3)).toBe(false);

		// @ts-expect-error Cannot apply MinCharacters<3> on LengthEqual<2>.
		expect(DString.minCharacters(sourceLength, 3)).toBe(false);
	});
});
