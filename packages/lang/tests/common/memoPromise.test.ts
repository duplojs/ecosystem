import { DCommon, type ExpectType } from "@scripts";

describe("memoPromise", () => {
	it("calls the getter once and memoizes the resolved value", async() => {
		let callCount = 0;
		const memoized = DCommon.memoPromise(() => {
			callCount++;

			return Promise.resolve("value" as const);
		});

		const first = memoized.value;
		const second = memoized.value;

		type _CheckValue = ExpectType<
			typeof memoized.value,
			"value" | Promise<"value">,
			"strict"
		>;

		expect(first).toBe(second);
		await expect(first).resolves.toBe("value");
		expect(memoized.value).toBe("value");
		expect(callCount).toBe(1);
	});

	it("rejects when the getter rejects", async() => {
		const error = new Error("failed");
		const memoized = DCommon.memoPromise(() => Promise.reject(error));

		await expect(memoized.value).rejects.toBe(error);
	});

	it("memoizes a synchronous getter", async() => {
		let callCount = 0;
		const memoized = DCommon.memoPromise(() => {
			callCount++;

			return 42 as const;
		});

		await expect(memoized.value).resolves.toBe(42);
		expect(memoized.value).toBe(42);
		expect(callCount).toBe(1);
	});
});
