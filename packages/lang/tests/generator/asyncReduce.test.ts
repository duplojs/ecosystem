import * as DGenerator from "@scripts/generator";
import * as DCommon from "@scripts/common";

describe("asyncReduce", () => {
	it("reduces async iterable values", async() => {
		const input = (async function *() {
			yield await Promise.resolve(2);
			yield await Promise.resolve(4);
			yield await Promise.resolve(6);
		})();
		const result = DGenerator.asyncReduce(
			input,
			0,
			(params) => params.next(params.lastValue + params.item + params.index),
		);

		await expect(result).resolves.toBe(15);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;
	});

	it("reduces from a wrapped object value", async() => {
		const result = DGenerator.asyncReduce(
			["a", "bb"] as const,
			DGenerator.reduceFrom({ total: 0 }),
			(params) => params.nextWithObject(
				params.lastValue,
				{ total: params.lastValue.total + params.item.length },
			),
		);

		await expect(result).resolves.toStrictEqual({ total: 3 });

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<{ total: number }>,
			"strict"
		>;
	});

	it("returns an early async exit value", async() => {
		const result = DGenerator.asyncReduce(
			[1, 2, 3],
			0,
			(params) => params.item === 2
				? params.exit("stop")
				: params.next(params.lastValue + params.item),
		);

		await expect(result).resolves.toBe("stop");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number | string>,
			"strict"
		>;
	});

	it("reduces values in pipe", async() => {
		const result = DCommon.pipe(
			[1, 2, 3],
			DGenerator.asyncReduce(1, (params) => params.next(params.lastValue * params.item)),
		);

		await expect(result).resolves.toBe(6);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<number>,
			"strict"
		>;
	});

	it("preserves item unions inside the async reducer callback", async() => {
		const input = (async function *() {
			yield await Promise.resolve(1 as 1 | "a");
			yield await Promise.resolve("a" as 1 | "a");
		})();
		const result = DGenerator.asyncReduce(
			input,
			DGenerator.reduceFrom<readonly (1 | "a")[]>([]),
			(params) => {
				type _CheckItem = DCommon.ExpectType<
					typeof params.item,
					1 | "a",
					"strict"
				>;

				return params.nextPush(params.lastValue, params.item);
			},
		);

		await expect(result).resolves.toStrictEqual([1, "a"]);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<readonly (1 | "a")[]>,
			"strict"
		>;
	});
});
