import { DCommon, type ExpectType } from "@scripts";

describe("justExec", () => {
	it("executes the callback and returns its output", () => {
		const callback = vi.fn(() => "value" as const);
		const result = DCommon.justExec(callback);

		type _CheckResult = ExpectType<
			typeof result,
			"value",
			"strict"
		>;

		expect(result).toBe("value");
		expect(callback).toHaveBeenCalledOnce();
	});
});
