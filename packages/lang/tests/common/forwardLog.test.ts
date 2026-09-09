import { DCommon, type ExpectType } from "@scripts";

describe("forwardLog", () => {
	it("logs and returns the input unchanged", () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
		const input = { value: "test" } as const;

		try {
			const result = DCommon.forwardLog(input);

			type _CheckResult = ExpectType<
				typeof result,
				typeof input,
				"strict"
			>;

			expect(result).toBe(input);
			expect(log).toHaveBeenCalledWith(input);
		} finally {
			log.mockRestore();
		}
	});
});
