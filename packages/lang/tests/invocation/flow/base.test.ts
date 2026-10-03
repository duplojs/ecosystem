import * as DInvocation from "@scripts/invocation";
import * as DEither from "@scripts/either";
import type * as DCommon from "@scripts/common";

describe("flow", () => {
	it("should execute simple pipes in sequence", () => {
		const useFlow = DInvocation.flow(
			(input: number) => input + 1,
			(input) => String(input),
			(input) => `value-${input}`,
		);
		const result = useFlow(41);

		expect(result).toBe("value-42");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			`value-${string}`,
			"strict"
		>;
	});

	it("passes the original argument to each step and keeps calls independent", () => {
		const observe = vi.fn((input: number, argument: { readonly value: number }) => input + argument.value);
		const useFlow = DInvocation.flow(
			(input: { readonly value: number }, argument) => {
				type _CheckArgument = DCommon.ExpectType<typeof argument, typeof input, "strict">;

				expect(argument).toBe(input);
				return input.value * 2;
			},
			observe,
			(input, argument) => {
				type _CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
				type _CheckArgument = DCommon.ExpectType<typeof argument, { readonly value: number }, "strict">;

				return input + argument.value;
			},
		);
		const first = { value: 3 } as const;
		const second = { value: 5 } as const;

		expect(useFlow(first)).toBe(12);
		expect(useFlow(second)).toBe(20);
		expect(observe).toHaveBeenNthCalledWith(1, 6, first);
		expect(observe).toHaveBeenNthCalledWith(2, 10, second);
	});

	it("preserves the original argument across async steps and controllers", async() => {
		const useFlow = DInvocation.flow(
			(input: string) => Promise.resolve(input.length),
			DInvocation.filter((input) => DEither.success(input + 1)),
			(input, argument) => {
				type _CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
				type _CheckArgument = DCommon.ExpectType<typeof argument, string, "strict">;

				return `${argument}:${input}`;
			},
		);
		const result = useFlow("test");

		await expect(result).resolves.toBe("test:5");

		type _CheckResult = DCommon.ExpectType<typeof result, Promise<`${string}:${number}`>, "strict">;
	});

	it("skips subsequent steps when a controller exits", () => {
		const next = vi.fn((input: number, argument: string) => `${argument}:${input}`);
		const useFlow = DInvocation.flow(
			(input: string) => input.length,
			DInvocation.filter((input) => input > 4 ? DEither.success(input) : DEither.error(input)),
			next,
		);

		expect(DEither.unwrapByInformationOrThrow(useFlow("test"), "error")).toBe(4);
		expect(next).not.toHaveBeenCalled();
		expect(useFlow("longer")).toBe("longer:6");
		expect(next).toHaveBeenCalledExactlyOnceWith(6, "longer");
	});
});
