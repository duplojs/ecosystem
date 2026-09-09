import * as DCommon from "@scripts/common";

type DiscriminateValue<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
> = Extract<GenericInput[GenericKey], DCommon.EligibleEqual>;

export function discriminate<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
	GenericValue extends DiscriminateValue<GenericInput, GenericKey>,
>(
	key: GenericKey,
	value: DCommon.MaybeArray<GenericValue>,
): (
	input: GenericInput,
) => input is Extract<
	GenericInput,
	{ [Prop in GenericKey]: GenericValue }
>;

export function discriminate<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
	GenericValue extends DiscriminateValue<GenericInput, GenericKey>,
>(
	input: GenericInput,
	key: GenericKey,
	value: DCommon.MaybeArray<GenericValue>,
): input is Extract<
	GenericInput,
	{ [Prop in GenericKey]: GenericValue }
>;

export function discriminate(
	...args:
		| [key: DCommon.ObjectKey, value: DCommon.MaybeArray<DCommon.EligibleEqual>]
		| [input: object, key: DCommon.ObjectKey, value: DCommon.MaybeArray<DCommon.EligibleEqual>]
) {
	if (args.length === 2) {
		const [key, value] = args;

		return (input: object) => discriminate(input, key as never, value as never);
	}

	const [input, key, value] = args;

	return DCommon.equal(
		(input as DCommon.AnyObject)[key],
		value as never,
	);
}
