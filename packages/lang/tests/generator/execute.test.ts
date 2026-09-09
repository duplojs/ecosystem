import { DGenerator, pipe, type ExpectType } from "@scripts";

describe("execute", () => {
	it("consumes a sync iterable", () => {
		const collected: string[] = [];
		const result = DGenerator.execute(
			DGenerator.map(["a", "b"], (item) => collected.push(item)),
		);

		expect(collected).toStrictEqual(["a", "b"]);

		type _CheckResult = ExpectType<
			typeof result,
			void,
			"strict"
		>;
	});

	it("consumes an async iterable", async() => {
		const collected: number[] = [];
		const result = DGenerator.execute(
			DGenerator.asyncMap([1, 2], async(item) => {
				await Promise.resolve();
				return collected.push(item);
			}),
		);

		await result;

		expect(collected).toStrictEqual([1, 2]);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<void>,
			"strict"
		>;
	});

	it("consumes values in pipe", () => {
		const collected: number[] = [];

		pipe(
			[1, 2],
			DGenerator.map((item) => collected.push(item * 2)),
			DGenerator.execute,
		);

		expect(collected).toStrictEqual([2, 4]);
	});
});
