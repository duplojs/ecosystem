import type { IsEqual } from "./types";

export type ExtractInterpolationId<
	GenericInput extends string,
> = GenericInput extends `${string}{${infer InferredInterpolationId}}${infer InferredEndValue}`
	? InferredInterpolationId | ExtractInterpolationId<InferredEndValue>
	: never;

export type ReplaceInterpolationIdByValues<
	GenericInput extends string,
	GenericInterpolationValues extends Record<string, string>,
> = GenericInput extends `${infer InferredStartValue}{${infer InferredInterpolationId}}${infer InferredEndValue}`
	? InferredInterpolationId extends keyof GenericInterpolationValues
		? `${InferredStartValue}${GenericInterpolationValues[InferredInterpolationId]}${ReplaceInterpolationIdByValues<InferredEndValue, GenericInterpolationValues>}`
		: `${InferredStartValue}${string}${ReplaceInterpolationIdByValues<InferredEndValue, GenericInterpolationValues>}`
	: GenericInput;

export type CreateInterpolationContract<
	GenericInterpolationFunction extends (interpolationValues: Record<string, string>) => string,
> = ReplaceInterpolationIdByValues<
	ReturnType<GenericInterpolationFunction>,
	{}
>;

export function createInterpolation<
	GenericTemplate extends string,
	GenericInterpolationId extends ExtractInterpolationId<GenericTemplate>,
	GenericStrict extends boolean,
>(
	template: GenericTemplate,
	strict?: GenericStrict,
): <
	GenericInterpolationMapperValue extends string,
	GenericInterpolationValues extends Record<GenericInterpolationId, GenericInterpolationMapperValue>,
>(
	...[interpolationValues]: IsEqual<GenericInterpolationId, never> extends true
		? []
		: [interpolationValues: GenericInterpolationValues]
) => IsEqual<GenericStrict, true> extends true
	? ReplaceInterpolationIdByValues<GenericTemplate, GenericInterpolationValues>
	: string;

export function createInterpolation(
	template: string,
	_strict?: boolean,
) {
	return (
		interpolationValues?: Record<string, string>,
	): string => (
		interpolationValues
			? template.replace(
				/\{([^}]*)\}/g,
				(_match, interpolationId: string) => interpolationValues[interpolationId]!,
			)
			: template
	);
}
