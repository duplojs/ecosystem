import { DEither, DInvocation, pipe, type ExpectType } from "@scripts";

describe("appendEvidence", () => {
	it("should append evidence in direct call", () => {
		const input = {
			id: "42",
		} as const;
		const result = DInvocation.appendEvidence(input, "user-loaded");

		expect(result).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			typeof input & DInvocation.Evidence<"user-loaded">,
			"strict"
		>;
	});

	it("should append evidence in pipe", () => {
		const input = {
			id: "42",
		} as const;
		const result = pipe(
			input,
			DInvocation.appendEvidence("user-loaded"),
		);

		expect(result).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			typeof input & DInvocation.Evidence<"user-loaded">,
			"strict"
		>;
	});
});

describe("evidenceResult", () => {
	it("should create an evidence result in direct call", () => {
		const input = {
			id: "42",
		} as const;
		const result = DInvocation.evidenceResult("user-loaded", input);

		expect(DEither.isRight(result)).toBe(true);
		expect(DEither.resultKind.has(result)).toBe(true);
		expect(DEither.informationKind.getValue(result)).toBe("user-loaded");
		expect(DEither.valueKind.getValue(result)).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			DInvocation.EvidenceResult<"user-loaded", typeof input>,
			"strict"
		>;
	});

	it("should create an evidence result in pipe", () => {
		const input = {
			id: "42",
		} as const;
		const result = pipe(
			input,
			DInvocation.evidenceResult("user-loaded"),
		);

		expect(result).toStrictEqual(DInvocation.evidenceResult("user-loaded", input));

		type _CheckResult = ExpectType<
			typeof result,
			DInvocation.EvidenceResult<"user-loaded", typeof input>,
			"strict"
		>;
	});

	it("should find evidence through promises and either results", () => {
		const getUser = () => Promise.resolve(
			DInvocation.evidenceResult("user-loaded", {
				id: "42",
			}),
		);

		type _CheckEvidence = ExpectType<
			DInvocation.GetEvidenceResult<typeof getUser, "user-loaded">,
			& { id: string }
			& DInvocation.Evidence<"user-loaded">,
			"strict"
		>;
	});
});
