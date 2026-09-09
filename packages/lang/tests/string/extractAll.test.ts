import { DArray, DString, pipe, type ExpectType } from "@scripts";

describe("extractAll", () => {
	it("should extract every match with groups", () => {
		const result = DString.extractAll(
			"price: 12 EUR, tax: 3 USD",
			/(\d+) (?<currency>[A-Z]+)/g,
		);

		expect(DArray.from(result)).toEqual([
			{
				matchedValue: "12 EUR",
				groups: ["12", "EUR"],
				namedGroups: { currency: "EUR" },
				offset: 7,
				self: "price: 12 EUR, tax: 3 USD",
			},
			{
				matchedValue: "3 USD",
				groups: ["3", "USD"],
				namedGroups: { currency: "USD" },
				offset: 20,
				self: "price: 12 EUR, tax: 3 USD",
			},
		]);

		type _CheckResult = ExpectType<
			typeof result,
			Generator<DString.ExtractOutput<"price: 12 EUR, tax: 3 USD">>,
			"strict"
		>;
	});

	it("should extract matches in pipe", () => {
		const result = pipe(
			"user-42-role-7",
			DString.extractAll(/\d+/g),
			DArray.from,
		);

		expect(result).toEqual([
			{
				matchedValue: "42",
				groups: [],
				namedGroups: undefined,
				offset: 5,
				self: "user-42-role-7",
			},
			{
				matchedValue: "7",
				groups: [],
				namedGroups: undefined,
				offset: 13,
				self: "user-42-role-7",
			},
		]);
	});

	it("should fallback to the input string when match details are missing", () => {
		const nativeMatchAll = String.prototype.matchAll;

		try {
			String.prototype.matchAll = function *() {
				yield ["user"] as RegExpMatchArray;
			} as never;

			expect(DArray.from(DString.extractAll("user", /user/g))).toEqual([
				{
					matchedValue: "user",
					groups: [],
					namedGroups: undefined,
					offset: 0,
					self: "user",
				},
			]);
		} finally {
			String.prototype.matchAll = nativeMatchAll;
		}
	});
});
