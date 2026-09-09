import type { AnyTuple, ComputedTypeError, IsEqual, IsNever, SimplifyTopLevel, UnionToTuple } from "./types";

type RequireEnumContractMissingValue<
	GenericValues extends AnyTuple<string>,
	GenericContractValue extends string,
> = Exclude<
	GenericValues[number],
	GenericContractValue
> extends infer InferredMissingValue extends string
	? IsNever<InferredMissingValue> extends true
		? unknown
		: ComputedTypeError<
			`Enum contract is missing value "${InferredMissingValue}".`
		>
	: never;

type RequireEnumContractUnknownValue<
	GenericValues extends AnyTuple<string>,
	GenericContractValue extends string,
> = Exclude<
	GenericContractValue,
	GenericValues[number]
> extends infer InferredUnknownValue extends string
	? IsNever<InferredUnknownValue> extends true
		? unknown
		: ComputedTypeError<
			`Enum contract contains unknown value "${InferredUnknownValue}".`
		>
	: never;

type RequireEnumContractUniqueValues<
	GenericValues extends AnyTuple<string>,
> = IsEqual<
	GenericValues["length"],
	UnionToTuple<GenericValues[number]>["length"]
> extends true
	? unknown
	: ComputedTypeError<"Enum values must not contain duplicates.">;

type RequireEnumContract<
	GenericValues extends AnyTuple<string>,
	GenericContractValue extends string,
> =
	& RequireEnumContractMissingValue<
		GenericValues,
		GenericContractValue
	>
	& RequireEnumContractUnknownValue<
		GenericValues,
		GenericContractValue
	>
	& RequireEnumContractUniqueValues<GenericValues>;

export type Enum<
	GenericValues extends AnyTuple<string>,
> = SimplifyTopLevel<
	{
		[Prop in GenericValues[number]]: Prop
	} & {
		toTuple(): GenericValues;
		has(value: string): value is GenericValues[number];
		contract<
			GenericContractValue extends string = GenericValues[number],
		>(
			...args: RequireEnumContract<
				GenericValues,
				GenericContractValue
			> extends infer InferredRequirement
				? IsEqual<InferredRequirement, unknown> extends true
					? []
					: [] & InferredRequirement
				: never
		): Enum<GenericValues>;
	}
>;

export function createEnum<
	const GenericValues extends AnyTuple<string>,
>(
	values: GenericValues,
): Enum<GenericValues> {
	return Object.fromEntries(
		[
			...values.map((value) => [value, value]),
			["toTuple", () => values],
			["has", (value: GenericValues[number]) => values.includes(value)],
			["contract", () => createEnum(values)],
		],
	);
}

export type GetEnumValue<
	GenericEnum extends { toTuple(): AnyTuple<string> },
> = ReturnType<GenericEnum["toTuple"]>[number];
