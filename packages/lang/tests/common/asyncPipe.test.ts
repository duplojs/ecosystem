import { asyncPipe, type ExpectType } from "@scripts";

describe("asyncPipe", () => {
	it("should await the input and every pipe output", async() => {
		const result = asyncPipe(
			Promise.resolve(20 as const),
			(value) => {
				expect(value).toBe(20);

				type _CheckInput = ExpectType<
					typeof value,
					20,
					"strict"
				>;

				return Promise.resolve("21" as const);
			},
			(value) => {
				expect(value).toBe("21");

				type _CheckInput = ExpectType<
					typeof value,
					"21",
					"strict"
				>;

				return Number(value);
			},
		);

		await expect(result).resolves.toBe(21);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;
	});
});
