import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DInvocation from "@scripts/invocation";

describe("filter", () => {
	it("should continue the flow with a raw filtered value", () => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => {
				type _CheckInput = DCommon.ExpectType<
					typeof input,
					number,
					"strict"
				>;

				return input + 1;
			}),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		expect(result).toBe("value-5");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`value-${number}`,
			"strict"
		>;
	});

	it("should pass only the resolved input to each filter callback", async() => {
		const filterFunction = vi.fn((input: number) => Promise.resolve(input + 1));
		const useFlow = DInvocation.flow(
			(input: { readonly value: number }) => Promise.resolve(input.value + 10),
			DInvocation.filter(filterFunction),
		);
		const firstResult = useFlow({ value: 1 });
		const secondResult = useFlow({ value: 2 });

		await expect(firstResult).resolves.toBe(12);
		await expect(secondResult).resolves.toBe(13);
		expect(filterFunction).toHaveBeenCalledTimes(2);
		expect(filterFunction).toHaveBeenNthCalledWith(1, 11);
		expect(filterFunction).toHaveBeenNthCalledWith(2, 12);

		type _CheckResult = DCommon.ExpectType<
			typeof firstResult,
			Promise<number>,
			"strict"
		>;
	});

	it("should reject a filter callback requiring the original argument", () => {
		// @ts-expect-error filter callbacks only receive the current input
		DInvocation.filter((input: number, argument: string) => `${argument}-${input}`);
	});

	it("should type the flow as async when a filter returns an async raw value", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => Promise.resolve(input + 1)),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		await expect(result).resolves.toBe("value-5");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<`value-${number}`>,
			"strict"
		>;
	});

	it("should type the flow as maybe async when a filter returns a sync or async raw value", () => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => input % 2 === 0
				? input + 1
				: Promise.resolve(input + 1)),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		expect(result).toBe("value-5");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DCommon.MaybePromise<`value-${number}`>,
			"strict"
		>;
	});

	it("should reject a filter with an incompatible input", () => {
		DInvocation.flow(
			(input: string) => input.length,
			// @ts-expect-error filter input must match the previous pipe output
			DInvocation.filter((input: string) => input.length),
		);
	});

	it("should continue the flow with the right value", () => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => DEither.result("accepted", input + 1)),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		expect(result).toBe("value-5");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`value-${number}`,
			"strict"
		>;
	});

	it("should exit the flow with the left value", () => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => input > 4
				? DEither.result("accepted", input)
				: DEither.left("too-short", input)),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		expect(result).toStrictEqual(DEither.left("too-short", 4));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| `value-${number}`
			| DEither.Left<"too-short", number>,
			"strict"
		>;
	});

	it("should type the flow as async when a filter returns an async either value", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => Promise.resolve(
				input > 4
					? DEither.result("accepted", input)
					: DEither.left("too-short", input),
			)),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		await expect(result).resolves.toStrictEqual(DEither.left("too-short", 4));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			Promise<
				| `value-${number}`
				| DEither.Left<"too-short", number>
			>,
			"strict"
		>;
	});

	it("should type the flow as maybe async when a filter returns a sync or async either value", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => input > 4
				? DEither.result("accepted", input)
				: Promise.resolve(DEither.left("too-short", input))),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		await expect(result).resolves.toStrictEqual(DEither.left("too-short", 4));

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DCommon.MaybePromise<
				| `value-${number}`
				| DEither.Left<"too-short", number>
			>,
			"strict"
		>;
	});

	it("should keep an existing flow exit", () => {
		const stopFlowKind = DInvocation.createKind("test-filter-stop-flow");
		const stopFlow = DInvocation.createFlowController(
			stopFlowKind,
			({ exitFlow, init }) => () => init(
				() => exitFlow(DEither.left("stopped", undefined)),
			),
		);
		const useFlow = DInvocation.flow(
			stopFlow(),
			DInvocation.filter(() => "accepted"),
			() => "next",
		);
		const result = useFlow(undefined);

		expect(result).toStrictEqual(DEither.left("stopped", undefined));
	});
});
