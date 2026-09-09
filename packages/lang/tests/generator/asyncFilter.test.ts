import { DArray, DGenerator, pipe, type ExpectType } from "@scripts";

describe("asyncFilter", () => {
	it("filters async iterable values", async() => {
		const input = (async function *() {
			yield await Promise.resolve(2 as const);
			yield await Promise.resolve(3 as const);
			yield await Promise.resolve(4 as const);
		})();
		const result = DGenerator.asyncFilter(
			input,
			(item, params) => item + params.index >= 4,
		);

		await expect(DArray.from(result)).resolves.toStrictEqual([3, 4]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<2 | 3 | 4, unknown, unknown>,
			"strict"
		>;
	});

	it("narrows values with a type predicate in pipe", async() => {
		const result = pipe(
			[1, "a", 2, "b"] as const,
			DGenerator.asyncFilter((item): item is "a" | "b" => typeof item === "string"),
		);

		await expect(DArray.from(result)).resolves.toStrictEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<"a" | "b", unknown, unknown>,
			"strict"
		>;
	});

	it("preserves item unions when filtering async iterable input with a boolean predicate", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as 1 | "a");
			yield await Promise.resolve("a" as 1 | "a");
		})();
		const result = DGenerator.asyncFilter(input, (item) => {
			type _CheckItem = ExpectType<
				typeof item,
				1 | "a",
				"strict"
			>;

			return true;
		});

		await expect(DArray.from(result)).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = ExpectType<
			typeof result,
			AsyncGenerator<1 | "a", unknown, unknown>,
			"strict"
		>;
	});
});
