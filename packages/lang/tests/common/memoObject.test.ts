import { DCommon, type ExpectType } from "@scripts";

describe("memoObject", () => {
	it("creates the object lazily and proxies its properties", () => {
		let callCount = 0;
		const memoized = DCommon.memoObject(() => {
			callCount++;

			return {
				name: "Jane",
				count: 1,
			};
		});

		type _CheckMemoized = ExpectType<
			typeof memoized,
			{
				name: string;
				count: number;
			},
			"strict"
		>;

		expect(callCount).toBe(0);
		expect(memoized.name).toBe("Jane");
		expect(callCount).toBe(1);
		expect(memoized.count).toBe(1);
		expect(callCount).toBe(1);
		expect("name" in memoized).toBe(true);
		expect(Object.keys(memoized)).toStrictEqual(["name", "count"]);
	});

	it("updates the proxied object and refreshes memoized keys", () => {
		const memoized = DCommon.memoObject<Record<string, number>>(() => ({
			count: 1,
		}));

		memoized.other = 2;

		expect(memoized.other).toBe(2);
		expect(Object.keys(memoized)).toStrictEqual(["count", "other"]);
	});
});
