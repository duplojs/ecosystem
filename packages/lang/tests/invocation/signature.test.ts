import * as DInvocation from "@scripts/invocation";
import type * as DCommon from "@scripts/common";

describe("signature", () => {
	it("preserves a generic function contract and attaches its signature", () => {
		type MySignedFunction = DInvocation.SignedFunction<"MySignedFunction", <GenericValue>(arg: GenericValue) => GenericValue>;
		const mySignedFunction: MySignedFunction = DInvocation.signedFunction("MySignedFunction", (arg) => arg);
		const result = mySignedFunction("test");

		expect(DInvocation.signatureKind.getValue(mySignedFunction)).toBe("MySignedFunction");
		expect(result).toBe("test");

		type _CheckResult = DCommon.ExpectType<typeof result, "test", "strict">;
	});

	it("keeps the function parameters, async result and literal signature", async() => {
		const original = vi.fn((value: number, prefix: string) => Promise.resolve(`${prefix}:${value}`));
		const signed = DInvocation.signedFunction<"Format", typeof original>("Format", original);
		const result = signed(3, "value");

		await expect(result).resolves.toBe("value:3");
		expect(original).toHaveBeenCalledExactlyOnceWith(3, "value");
		expect(DInvocation.signatureKind.getValue(signed)).toBe("Format");

		type _CheckParameters = DCommon.ExpectType<Parameters<typeof signed>, [value: number, prefix: string], "strict">;
		type _CheckResult = DCommon.ExpectType<typeof result, Promise<string>, "strict">;
		type _CheckSignature = DCommon.ExpectType<typeof signed, DInvocation.SignedFunction<"Format", typeof original>, "strict">;
	});
});
