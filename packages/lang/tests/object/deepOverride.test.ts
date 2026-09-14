import { type DArray, type DCommon, DModeling, type DNumber, DObject, pipe, type ExpectType } from "@scripts";

describe("deepOverride", () => {
	it("should deeply override defined values", () => {
		const source = {
			name: "Duplo",
			metadata: {
				version: 1,
				enabled: true,
			},
		};
		const result = DObject.deepOverride(source, {
			metadata: {
				version: 2,
				enabled: undefined,
			},
		});

		expect(result).toEqual({
			name: "Duplo",
			metadata: {
				version: 2,
				enabled: true,
			},
		});
		expect(result).not.toBe(source);
		expect(result.metadata).not.toBe(source.metadata);

		type _CheckResult = ExpectType<
			typeof result,
			{
				name: string;
				metadata: {
					version: number;
					enabled: boolean;
				};
			},
			"strict"
		>;
	});

	it("should deeply override arrays without mutating the source", () => {
		const source = {
			items: [
				{
					name: "first",
					count: 1,
				},
				{
					name: "second",
					count: 2,
				},
			],
		};
		const result = DObject.deepOverride(source, {
			items: [
				undefined,
				{
					count: 3,
				},
				undefined,
				{
					name: "fourth",
					count: 4,
				},
			],
		});

		expect(result).toEqual({
			items: [
				{
					name: "first",
					count: 1,
				},
				{
					name: "second",
					count: 3,
				},
			],
		});
		expect(result.items).not.toBe(source.items);
		expect(result.items[0]).toBe(source.items[0]);
		expect(result.items[1]).not.toBe(source.items[1]);
		expect(source.items).toEqual([
			{
				name: "first",
				count: 1,
			},
			{
				name: "second",
				count: 2,
			},
		]);
	});

	it("should ignore structured overrides incompatible with the source", () => {
		const source = {
			primitive: "value",
			object: { value: 1 },
			array: [1, 2],
		};
		const result = DObject.deepOverride(
			source,
			{
				primitive: { invalid: true },
				object: ["invalid"],
				array: { invalid: true },
			} as never,
		);

		expect(result).toEqual(source);
		expect(result).not.toBe(source);
		const incompatibleResult = DObject.deepOverride(source, [] as never);

		expect(incompatibleResult).toEqual(source);
		expect(incompatibleResult).toBe(source);
	});

	it("should not allow overriding an object union", () => {
		type ObjectUnion =
			| {
				kind: "left";
				left: number;
			}
			| {
				kind: "right";
				right: string;
			};

		const source: {
			value: ObjectUnion;
		} = {
			value: {
				kind: "left",
				left: 1,
			},
		};
		const result = DObject.deepOverride(source, {
			value: undefined,
		});

		expect(result).toEqual(source);
		const getRootSource = (): ObjectUnion => source.value;
		const rootSource = getRootSource();
		const rootResult = DObject.deepOverride<ObjectUnion>(rootSource, undefined);

		expect(rootResult).toBe(rootSource);

		DObject.deepOverride(source, {
			// @ts-expect-error An object union cannot be deeply overridden safely.
			value: {
				left: 2,
			},
		});

		const completeUnionValue: ObjectUnion = {
			kind: "right",
			right: "value",
		};

		DObject.deepOverride(source, {
			// @ts-expect-error Even a complete object union value cannot be overridden.
			value: completeUnionValue,
		});
	});

	it("should preserve tuple positions and protect constrained arrays", () => {
		const source: {
			tuple: readonly [
				string,
				{
					enabled: boolean;
					label: string;
				},
			];
			constrained: string[] & DArray.MinElements<2>;
		} = {
			tuple: [
				"first",
				{
					enabled: false,
					label: "second",
				},
			],
			constrained: ["first", "second"] as string[] & DArray.MinElements<2>,
		};
		const constrainedOverride = ["updated", "values"] as string[] & DArray.MinElements<2>;
		const result = DObject.deepOverride(source, {
			tuple: [undefined, { enabled: true }],
			constrained: undefined,
		});

		expect(result).toEqual({
			tuple: [
				"first",
				{
					enabled: true,
					label: "second",
				},
			],
			constrained: ["first", "second"],
		});

		DObject.deepOverride(source, {
			// @ts-expect-error A constrained array can only receive undefined.
			constrained: constrainedOverride,
		});

		DObject.deepOverride(source, {
			// @ts-expect-error A constrained array can only receive undefined.
			constrained: [],
		});
	});

	it("should treat functions as atomic values", () => {
		const initialCallback = () => 1;
		const overrideCallback = () => 2;
		const source = {
			callback: initialCallback,
		};
		const result = DObject.deepOverride(source, {
			callback: overrideCallback,
		});

		expect(result.callback).toBe(overrideCallback);
		expect(result.callback()).toBe(2);

		DObject.deepOverride(source, {
			// @ts-expect-error A function cannot receive a partial object override.
			callback: {},
		});
	});

	it("should require constrained primitive values entirely", () => {
		const source: {
			count: number & DNumber.Positive;
		} = {
			count: 1 as number & DNumber.Positive,
		};
		const constrainedOverride = 2 as number & DNumber.Positive;
		const result = DObject.deepOverride(source, {
			count: constrainedOverride,
		});

		expect(result.count).toBe(constrainedOverride);

		DObject.deepOverride(source, {
			// @ts-expect-error An unconstrained primitive cannot replace a constrained value.
			count: -1,
		});
	});

	it("should allow primitive overrides after excluding object unions", () => {
		type MixedValue =
			| {
				kind: "first";
				first: string;
			}
			| {
				kind: "second";
				second: number;
			}
			| (number & DNumber.Positive);

		const source: {
			value: MixedValue;
		} = {
			value: {
				kind: "first",
				first: "value",
			},
		};
		const constrainedOverride = 2 as number & DNumber.Positive;
		const result = DObject.deepOverride(source, {
			value: constrainedOverride,
		});
		const unconstrainedResult = DObject.deepOverride(source, {
			value: -1,
		});

		expect(result.value).toBe(constrainedOverride);
		expect(unconstrainedResult.value).toBe(-1);

		type _CheckResult = ExpectType<
			typeof unconstrainedResult,
			typeof source,
			"strict"
		>;
	});

	it("should only allow undefined for constrained objects", () => {
		type ExclusiveObject = {
			first?: number;
			second?: number;
		} & DCommon.Constraint<"exclusive-object">;

		const source = {
			first: 1,
		} as ExclusiveObject;
		const constrainedOverride = {
			second: 2,
		} as ExclusiveObject;
		const result = DObject.deepOverride(source, undefined);

		expect(result).toBe(source);

		DObject.deepOverride(
			source,
			// @ts-expect-error A constrained object can only receive undefined.
			constrainedOverride,
		);

		DObject.deepOverride(
			source,
			// @ts-expect-error A constrained object can only receive undefined.
			{ second: 2 },
		);
	});

	it("should deeply override modeling entities and support kinded overrides", () => {
		const source = DModeling.entityKind.addTo(
			{
				profile: {
					name: "Duplo",
					metadata: {
						enabled: false,
						version: 1,
					},
				},
			},
			"user",
		);
		const result = DObject.deepOverride(source, {
			profile: {
				metadata: {
					enabled: true,
				},
			},
		});

		expect(result).toEqual({
			profile: {
				name: "Duplo",
				metadata: {
					enabled: true,
					version: 1,
				},
			},
			[DModeling.entityKind.runTimeKey]: "user",
		});
		expect(DModeling.entityKind.has(result)).toBe(true);
		expect(DModeling.entityKind.getValue(result)).toBe("user");

		type _CheckResult = ExpectType<
			typeof result,
			typeof source,
			"strict"
		>;

		const kindedOverride = DModeling.entityKind.addTo(
			{
				profile: {
					name: "DuploJS",
					metadata: {
						enabled: true,
						version: 2,
					},
				},
			},
			"administrator",
		);
		const kindedResult = DObject.deepOverride(source, kindedOverride);

		expect(kindedResult.profile.name).toBe("DuploJS");
		expect(DModeling.entityKind.getValue(kindedResult)).toBe("administrator");
	});

	it("should protect constrained objects nested in tuples", () => {
		type ConstrainedObject = {
			value: number;
		} & DCommon.Constraint<"tuple-object">;

		const constrainedValue = {
			value: 1,
		} as ConstrainedObject;
		const source: {
			tuple: readonly [ConstrainedObject];
		} = {
			tuple: [constrainedValue],
		};

		DObject.deepOverride(source, {
			tuple: [undefined],
		});

		DObject.deepOverride(source, {
			tuple: [
				// @ts-expect-error A constrained tuple member can only receive undefined.
				constrainedValue,
			],
		});
	});

	it("should deeply override values in pipe", () => {
		const source: {
			metadata: {
				version: number;
				enabled: boolean;
			};
		} = {
			metadata: {
				version: 1,
				enabled: false,
			},
		};
		const result = pipe(
			source,
			DObject.deepOverride({ metadata: { version: 2 } }),
		);

		expect(result).toEqual({
			metadata: {
				version: 2,
				enabled: false,
			},
		});

		type _CheckResult = ExpectType<
			typeof result,
			typeof source,
			"strict"
		>;
	});
});
