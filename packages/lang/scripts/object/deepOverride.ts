import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { isSimple } from "./isSimple";
import { type Values, type HasKeySignature, type keyofWithoutSignature } from "./types";

type DeepOverrideParameter<
	GenericValue extends unknown,
> = (
	GenericValue extends unknown
		? readonly [
			GenericValue,
			DCommon.RemoveConstraint<GenericValue>,
		]
		: never
) extends infer InferredItem extends readonly [unknown, unknown]
	? DCommon.IsUnion<Extract<InferredItem[1], object>> extends true
		? Exclude<InferredItem[1], object> | undefined
		: InferredItem extends unknown
			? InferredItem[1] extends DCommon.AnyFunction
				? InferredItem[0]
				: InferredItem[1] extends object
					? InferredItem[0] extends DCommon.Constraint
						? undefined
						: InferredItem[1] extends readonly unknown[]
							? InferredItem[1] extends readonly [
								infer InferredFirst,
								...infer InferredRest,
							]
								? readonly [
									DeepOverrideParameter<InferredFirst> | undefined,
									...Extract<
										DeepOverrideParameter<InferredRest>,
										readonly unknown[]
									>,
								]
								: InferredItem[1] extends readonly []
									? readonly []
									: readonly (
										| DeepOverrideParameter<InferredItem[1][number]>
										| undefined
									)[]
							: DCommon.SimplifyTopLevel<
								& {
									readonly [
									Prop in Exclude<keyofWithoutSignature<InferredItem[1]>, DKind.KeySymbol>
									]?: DeepOverrideParameter<InferredItem[1][Prop]> | undefined
								}
								& (
									HasKeySignature<InferredItem[1]> extends true
										? { readonly [key: string]: InferredItem[1][keyof InferredItem[1]] }
										: unknown
								)
							>
					: InferredItem[0] | undefined
			: never
	: never;

export function deepOverride<
	GenericObject extends object,
>(
	value: NoInfer<DeepOverrideParameter<GenericObject>>,
): (
	object: GenericObject,
) => GenericObject;

export function deepOverride<
	GenericObject extends object,
>(
	object: GenericObject,
	value: NoInfer<DeepOverrideParameter<GenericObject>>,
): GenericObject;

export function deepOverride(
	...args:
		| [value: unknown]
		| [object: object, value: unknown]
): any {
	if (args.length === 1) {
		const [value] = args;

		return (object: object) => deepOverride(object, value as never);
	}

	const [object, initialValue] = args;

	return DCommon.justExec(
		function override(
			value: unknown = initialValue,
			currentValue: unknown = object,
		): unknown {
			if (value === undefined) {
				return currentValue;
			}

			if (Array.isArray(value)) {
				if (!Array.isArray(currentValue)) {
					return currentValue;
				}

				const result: unknown[] = [...currentValue];
				const commonLength = Math.min(currentValue.length, value.length);

				for (let index = 0; index < commonLength; index++) {
					const overrideValue: unknown = value[index];

					if (overrideValue !== undefined) {
						result[index] = override(overrideValue, currentValue[index]);
					}
				}

				return result;
			}
			if (isSimple(value)) {
				if (!isSimple(currentValue)) {
					return currentValue;
				}

				return Object.entries(value).reduce(
					(result, [key, overrideValue]) => {
						if (overrideValue !== undefined) {
							result[key] = override(overrideValue, result[key]);
						}

						return result;
					},
					{ ...currentValue } as Record<string, unknown>,
				);
			}

			return value;
		},
	);
}
