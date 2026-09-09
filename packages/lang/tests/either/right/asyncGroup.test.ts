import { DEither, type ExpectType } from "@scripts";

describe("asyncGroup", () => {
	it("should aggregate object right values into an async success", async() => {
		const result = DEither.asyncGroup({
			first: Promise.resolve(DEither.success(1)),
			second: () => Promise.resolve(DEither.right("second", "value")),
		});

		await expect(result).resolves.toStrictEqual(DEither.success({
			first: 1,
			second: "value",
		}));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<DEither.Success<{
				first: 1;
				second: "value";
			}>>,
			"strict"
		>;
	});

	it("should return the first async left value from an object and stop evaluation", async() => {
		const error = DEither.error("message");
		const spy = vi.fn(() => DEither.success(2));
		const result = DEither.asyncGroup({
			first: Promise.resolve(DEither.success(1)),
			error: () => Promise.resolve(error),
			skipped: spy,
		});

		await expect(result).resolves.toBe(error);
		expect(spy).not.toHaveBeenCalled();
	});

	it("should aggregate tuple right values into an async success", async() => {
		const result = DEither.asyncGroup([
			Promise.resolve(DEither.success(1)),
			() => Promise.resolve(DEither.right("second", "value")),
		] as const);

		await expect(result).resolves.toStrictEqual(DEither.success([1, "value"]));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<DEither.Success<[1, "value"]>>,
			"strict"
		>;
	});

	it("should aggregate array right values into an async success", async() => {
		const first = Number(1);
		const second = String("value");
		const group = [
			Promise.resolve(DEither.success(first)),
			() => Promise.resolve(DEither.right("second", second)),
		];
		const result = DEither.asyncGroup(group);

		await expect(result).resolves.toStrictEqual(DEither.success([1, "value"]));

		type _CheckResult = ExpectType<
			typeof result,
			Promise<DEither.Success<(number | string)[]>>,
			"strict"
		>;
	});

	it("should return the first async left value from an array and stop evaluation", async() => {
		const error = DEither.error("message");
		const spy = vi.fn(() => DEither.success(2));
		const result = DEither.asyncGroup([
			Promise.resolve(DEither.success(1)),
			() => Promise.resolve(error),
			spy,
		]);

		await expect(result).resolves.toBe(error);
		expect(spy).not.toHaveBeenCalled();
	});
});
