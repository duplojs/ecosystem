import { DString, pipe, type ExpectType } from "@scripts";

describe("replace", () => {
	it("should replace the first matching string", () => {
		const result = DString.replace("hello hello", "hello", "hi");

		expect(result).toBe("hi hello");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;
	});

	it("should replace a matching string in pipe", () => {
		const result = pipe(
			"hello world",
			DString.replace("world", "duplo"),
		);

		expect(result).toBe("hello duplo");
	});

	it("should call replacer with match details", () => {
		const result = DString.replace(
			"price: 12 EUR",
			/(\d+) (?<currency>[A-Z]+)/,
			(params) => {
				expect(params).toEqual({
					matchedValue: "12 EUR",
					groups: ["12", "EUR"],
					namedGroups: { currency: "EUR" },
					offset: 7,
					self: "price: 12 EUR",
				});

				type _CheckSelf = ExpectType<
					typeof params.self,
					"price: 12 EUR",
					"strict"
				>;

				type _CheckNamedGroups = ExpectType<
					typeof params.namedGroups,
					Record<string, string | undefined>,
					"strict"
				>;

				return `${params.groups[0]} ${params.namedGroups.currency?.toLowerCase()}`;
			},
		);

		expect(result).toBe("price: 12 eur");
	});

	it("should call replacer without named groups", () => {
		const result = DString.replace(
			"item-42",
			/(\d+)/,
			(params) => {
				expect(params.namedGroups).toEqual({});

				return `${params.matchedValue}:${Object.keys(params.namedGroups).length}`;
			},
		);

		expect(result).toBe("item-42:0");
	});
});
