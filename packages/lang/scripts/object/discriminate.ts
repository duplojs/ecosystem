import type * as DCommon from "@scripts/common";

export function discriminate<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
	GenericPredicatedValue extends GenericInput[GenericKey],
>(
	key: GenericKey,
	predicate: (value: GenericInput[GenericKey]) => value is GenericPredicatedValue,
): (
	input: GenericInput,
) => input is GenericInput & { [Prop in GenericKey]: GenericPredicatedValue };

export function discriminate<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
>(
	key: GenericKey,
	predicate: (value: GenericInput[GenericKey]) => boolean,
): (input: GenericInput) => boolean;

export function discriminate<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
	GenericPredicatedValue extends GenericInput[GenericKey],
>(
	input: GenericInput,
	key: GenericKey,
	predicate: (value: GenericInput[GenericKey]) => value is GenericPredicatedValue,
): input is GenericInput & { [Prop in GenericKey]: GenericPredicatedValue };

export function discriminate<
	GenericInput extends object,
	GenericKey extends keyof GenericInput,
>(
	input: GenericInput,
	key: GenericKey,
	predicate: (value: GenericInput[GenericKey]) => boolean,
): boolean;

export function discriminate(
	...args:
		| [key: DCommon.ObjectKey, predicate: DCommon.AnyFunction]
		| [input: object, key: DCommon.ObjectKey, predicate: DCommon.AnyFunction]
) {
	if (args.length === 2) {
		const [key, predicate] = args;

		return (input: object) => discriminate(input, key as never, predicate as never);
	}

	const [input, key, predicate] = args;

	return predicate((input as DCommon.AnyObject)[key]);
}
