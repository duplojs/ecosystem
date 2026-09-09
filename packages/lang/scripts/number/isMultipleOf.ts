import type * as DCommon from "@scripts/common";
import type { MultipleOf } from "./constraints";
import type { RequireSimpleLiteral } from "./types";

type RequireApplyMultiplyOf<
	GenericMultiple extends number,
> = RequireSimpleLiteral<GenericMultiple>;

type RequireApplyMultiplyOfBoolean<
	GenericMultiple extends number,
> = DCommon.IsEqual<GenericMultiple, number> extends true
	? unknown
	: RequireApplyMultiplyOf<GenericMultiple>;

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	multiple: GenericMultiple & RequireApplyMultiplyOf<GenericMultiple>,
): (
	value: GenericValue,
) => value is GenericValue & MultipleOf<GenericMultiple>;

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	multiple: GenericMultiple & RequireApplyMultiplyOfBoolean<GenericMultiple>,
): (
	value: GenericValue,
) => boolean;

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	value: GenericValue,
	multiple: GenericMultiple & RequireApplyMultiplyOf<GenericMultiple>,
): value is GenericValue & MultipleOf<GenericMultiple>;

export function isMultipleOf<
	GenericValue extends number,
	const GenericMultiple extends number,
>(
	value: GenericValue,
	multiple: GenericMultiple & RequireApplyMultiplyOfBoolean<GenericMultiple>,
): boolean;

export function isMultipleOf(
	...args:
		| [multiple: number]
		| [value: number, multiple: number]
): any {
	if (args.length === 1) {
		const [multiple] = args;

		return (value: number) => isMultipleOf(value, multiple as never);
	}

	const [value, multiple] = args;

	return value % multiple === 0;
}
