import { DEither, type ExpectType } from "@scripts";

describe("group", () => {
	it("should aggregate object right values into a success", () => {
		const result = DEither.group({
			first: DEither.success(1),
			second: () => DEither.right("second", "value"),
		});

		expect(result).toStrictEqual(DEither.success({
			first: 1,
			second: "value",
		}));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<{
				first: 1;
				second: "value";
			}>,
			"strict"
		>;
	});

	it("should return the first left value from an object and stop evaluation", () => {
		const error = DEither.error("message");
		const spy = vi.fn(() => DEither.success(2));
		const result = DEither.group({
			first: DEither.success(1),
			error: () => error,
			skipped: spy,
		});

		expect(result).toBe(error);
		expect(spy).not.toHaveBeenCalled();
	});

	it("should aggregate tuple right values into a success", () => {
		const result = DEither.group([
			DEither.success(1),
			() => DEither.right("second", "value"),
		] as const);

		expect(result).toStrictEqual(DEither.success([1, "value"]));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<[1, "value"]>,
			"strict"
		>;
	});

	it("should aggregate array right values into a success", () => {
		const first = Number(1);
		const second = String("value");
		const group = [
			DEither.success(first),
			() => DEither.right("second", second),
		];
		const result = DEither.group(group);

		expect(result).toStrictEqual(DEither.success([1, "value"]));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Success<(number | string)[]>,
			"strict"
		>;
	});

	it("should return the first left value from an array and stop evaluation", () => {
		const error = DEither.error("message");
		const spy = vi.fn(() => DEither.success(2));
		const result = DEither.group([
			DEither.success(1),
			() => error,
			spy,
		]);

		expect(result).toBe(error);
		expect(spy).not.toHaveBeenCalled();
	});
});
