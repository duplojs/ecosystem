
import * as DCommon from "@scripts/common";

describe("justExec", () => {
	it("executes the callback and returns its output", () => {
		const callback = vi.fn(() => "value" as const);
		const result = DCommon.justExec(callback);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"value",
			"strict"
		>;

		expect(result).toBe("value");
		expect(callback).toHaveBeenCalledOnce();
	});
});
