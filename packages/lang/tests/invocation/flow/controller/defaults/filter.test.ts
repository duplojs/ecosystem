import { DEither, DInvocation, type DCommon, type ExpectType } from "@scripts";

describe("filter", () => {
	it("should continue the flow with a raw filtered value", () => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => {
				type _CheckInput = ExpectType<
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

		type _CheckResult = ExpectType<
			typeof result,
			`value-${number}`,
			"strict"
		>;
	});

	it("should type the flow as async when a filter returns an async raw value", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => Promise.resolve(input + 1)),
			(input) => `value-${input}`,
		);
		const result = useFlow("test");

		await expect(result).resolves.toBe("value-5");

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
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
				() => exitFlow(DEither.left("stopped")),
			),
		);
		const useFlow = DInvocation.flow(
			stopFlow(),
			DInvocation.filter(() => "accepted"),
			() => "next",
		);
		const result = useFlow(undefined);

		expect(result).toStrictEqual(DEither.left("stopped"));
	});
});
