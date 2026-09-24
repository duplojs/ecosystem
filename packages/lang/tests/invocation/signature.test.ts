import { DInvocation } from "@scripts";

describe("signature", () => {
	it("signature", () => {
		type MySignedFunction = DInvocation.SignedFunction<
			"MySignedFunction",
			<GenericT>(arg: GenericT) => GenericT
		>;

		const mySignedFunction: MySignedFunction = DInvocation
			.signedFunction(
				"MySignedFunction",
				(arg) => arg,
			);

		expect(DInvocation.signatureKind.getValue(mySignedFunction)).toBe("MySignedFunction");
		expect(mySignedFunction("test")).toBe("test");
	});
});
