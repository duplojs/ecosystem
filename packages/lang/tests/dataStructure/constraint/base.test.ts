import { DDataStructure, type DCommon, type DKind, type ExpectType } from "@scripts";
import type { ConstraintDefinition } from "@scripts/dataStructure";

declare module "@scripts/dataStructure" {
	interface Constraint<
		GenericInput extends unknown = unknown,
		GenericChecked extends GenericInput = GenericInput,
		GenericDefinition extends ConstraintDefinition = ConstraintDefinition,
	> {
		getPrototypeOverrideLabel?(prefix: string): `${string}:${string}`;
		testedValue?: string;
	}
}

describe("createConstraint", () => {
	it("creates a constraint constructor that initializes definitions and delegates checks with itself", () => {
		const testConstraintKind = DDataStructure.createKind("test-constraint");

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly min: 3;
		}

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<
				string,
				string & { readonly minLength: 3 },
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestConstraint,
				data: string,
			) => data.length >= self.definition.min
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);
		const isAsynchronous = vi.fn(() => false);

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<TestConstraint>(
				{ min: 3 },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const constraint = TestConstraint();

		type _CheckConstraint = ExpectType<
			typeof constraint,
			TestConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			{ readonly minLength: 3 },
			"strict"
		>;

		expect(constraint.definition).toEqual({ min: 3 });
		expect(constraint.executeCheck("abc")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("ab")).toBe(DDataStructure.ErrorSymbol);
		expect(constraint.isAsynchronous()).toBe(false);
		expect(executeCheck).toHaveBeenNthCalledWith(
			1,
			constraint,
			"abc",
		);
		expect(executeCheck).toHaveBeenNthCalledWith(
			2,
			constraint,
			"ab",
		);
		expect(isAsynchronous).toHaveBeenCalledWith(constraint);
	});

	it("clones a constraint with the same behavior", () => {
		const testConstraintKind = DDataStructure.createKind("test-clone-constraint");

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly min: 3;
		}

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<
				string,
				string & { readonly minLength: 3 },
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestConstraint,
				data: string,
			) => data.length >= self.definition.min
				? DDataStructure.SuccessSymbol
				: DDataStructure.ErrorSymbol,
		);
		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<TestConstraint>(
				{ min: 3 },
				{
					executeCheck,
					isAsynchronous: () => false,
				},
			),
		);

		const constraint = TestConstraint();
		const clonedConstraint = constraint.clone();

		type _CheckClonedConstraint = ExpectType<
			typeof clonedConstraint,
			TestConstraint,
			"strict"
		>;

		expect(clonedConstraint).not.toBe(constraint);
		expect(clonedConstraint.definition).toStrictEqual(constraint.definition);
		expect(clonedConstraint.definition).not.toBe(constraint.definition);
		expect(DDataStructure.constraintKind.has(clonedConstraint)).toBe(true);
		expect(testConstraintKind.has(clonedConstraint)).toBe(true);
		expect(clonedConstraint.executeCheck("abc")).toBe(
			DDataStructure.SuccessSymbol,
		);
		expect(executeCheck).toHaveBeenCalledWith(
			clonedConstraint,
			"abc",
		);
	});

	it("sets messages directly and on cloned constraints", () => {
		const testConstraintKind = DDataStructure.createKind("test-message-constraint");

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<TestConstraint>(
				{},
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					isAsynchronous: () => false,
				},
			),
		);

		const constraint = TestConstraint();
		const sameConstraint = constraint.setMessage("Direct message");

		type _CheckSameConstraint = ExpectType<
			typeof sameConstraint,
			TestConstraint,
			"strict"
		>;

		expect(sameConstraint).toBe(constraint);
		expect(constraint.definition.message).toBe("Direct message");

		const clonedConstraint = constraint.addMessage("Cloned message");

		type _CheckClonedConstraint = ExpectType<
			typeof clonedConstraint,
			TestConstraint,
			"strict"
		>;

		expect(constraint.definition.message).toBe("Direct message");
		expect(clonedConstraint).not.toBe(constraint);
		expect(clonedConstraint.definition).not.toBe(constraint.definition);
		expect(clonedConstraint.definition.message).toBe("Cloned message");
		expect(clonedConstraint.executeCheck("value")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("preserves asynchronous checks", async() => {
		const testConstraintKind = DDataStructure.createKind("test-async-constraint");

		interface TestConstraintDefinition extends DDataStructure.ConstraintDefinition {
			readonly min: number;
		}

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<
				string,
				string & { readonly minLength: number },
				TestConstraintDefinition
			>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const executeCheck = vi.fn(
			(
				self: TestConstraint,
				data: string,
			) => Promise.resolve(
				data.length >= self.definition.min
					? DDataStructure.SuccessSymbol
					: DDataStructure.ErrorSymbol,
			),
		);
		const isAsynchronous = vi.fn(() => true);

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => (min: number) => init<TestConstraint>(
				{ min },
				{
					executeCheck,
					isAsynchronous,
				},
			),
		);

		const constraint = TestConstraint(4);

		expect(constraint.definition).toEqual({ min: 4 });
		await expect(
			constraint.executeCheck("abc"),
		).resolves.toBe(DDataStructure.ErrorSymbol);
		expect(constraint.isAsynchronous()).toBe(true);
		expect(executeCheck).toHaveBeenCalledWith(
			constraint,
			"abc",
		);
		expect(isAsynchronous).toHaveBeenCalledWith(constraint);
	});

	it("adds methods to the constraint prototype", () => {
		const prototype = DDataStructure.ConstraintBase.prototype as DDataStructure.Constraint;

		try {
			DDataStructure.ConstraintBase.addToPrototype(
				"clone",
				(() => "prototype-clone") as never,
			);

			expect(prototype.clone()).toBe("prototype-clone");
		} finally {
			delete (prototype as Partial<DDataStructure.Constraint>).clone;
		}
	});

	it("adds module-augmented methods to the constraint prototype", () => {
		const prototype = DDataStructure.ConstraintBase.prototype as DDataStructure.Constraint;
		const testConstraintKind = DDataStructure.createKind("test-prototype-constraint");

		interface TestConstraint extends DCommon.Forward<
			& DDataStructure.Constraint<string>
			& DKind.Kind<typeof testConstraintKind>
		> {}

		const TestConstraint = DDataStructure.createConstraint(
			testConstraintKind,
			({ init }) => () => init<TestConstraint>(
				{ message: "base" },
				{
					executeCheck: () => DDataStructure.SuccessSymbol,
					isAsynchronous: () => false,
				},
			),
		);

		try {
			DDataStructure.ConstraintBase.addToPrototype(
				"getPrototypeOverrideLabel",
				(self, prefix) => `${prefix}:${self.definition.message ?? ""}`,
			);
			DDataStructure.ConstraintBase.addToPrototype(
				"testedValue",
				"test",
			);

			const constraint = TestConstraint();
			const getPrototypeOverrideLabel = constraint.getPrototypeOverrideLabel!;
			const result = getPrototypeOverrideLabel("message");

			expect(result).toBe("message:base");
			expect(constraint.testedValue).toBe("test");

			type _CheckResult = ExpectType<
				typeof result,
				`${string}:${string}`,
				"strict"
			>;
		} finally {
			delete (prototype as Partial<DDataStructure.Constraint>).getPrototypeOverrideLabel;
			delete (prototype as Partial<DDataStructure.Constraint>).testedValue;
		}
	});
});
