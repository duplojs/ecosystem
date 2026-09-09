import { DArray, DGenerator, type ExpectType } from "@scripts";

describe("createExternalAsyncGenerator", () => {
	it("yields the next external value", async() => {
		const external = DGenerator.createExternalAsyncGenerator<number>();
		const result = DArray.from(external.asyncGenerator);

		external.next(12);

		await expect(result).resolves.toStrictEqual([12]);

		type _CheckExternal = ExpectType<
			typeof external,
			{
				asyncGenerator: AsyncGenerator<number, void, unknown>;
				next(item: number): undefined;
				exit(): undefined;
			},
			"strict"
		>;
	});

	it("exits without yielding a value", async() => {
		const external = DGenerator.createExternalAsyncGenerator<number>();
		const result = DArray.from(external.asyncGenerator);

		external.exit();

		await expect(result).resolves.toStrictEqual([]);
	});

	it("ignores calls made before the generator is consumed", async() => {
		const external = DGenerator.createExternalAsyncGenerator<number>();

		external.next(1);
		external.exit();

		const result = DArray.from(external.asyncGenerator);

		external.next(7);

		await expect(result).resolves.toStrictEqual([7]);
	});
});
