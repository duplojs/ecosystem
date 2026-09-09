import type * as DCommon from "@scripts/common";

type CreateTupleFromArray<
	GenericInput extends readonly any[],
> = GenericInput extends DCommon.AnyTuple
	? GenericInput
	: [GenericInput[number], ...GenericInput];

export type MergeUnion<
	GenericTuple extends DCommon.AnyTuple,
> = DCommon.IsUnion<GenericTuple> extends true
	? [
		GenericTuple[0],
		...(
			Extract<GenericTuple, any> extends [any, ...infer InferredRest]
				? DCommon.IsEqual<
					Extract<InferredRest, DCommon.AnyTuple | []>,
					never
				> extends true
					? InferredRest[number][]
					: (
						Exclude<InferredRest, readonly []> extends infer InferredValue extends readonly any[]
							? DCommon.IsEqual<InferredValue, never> extends true
								? []
								: Extract<MergeUnion<CreateTupleFromArray<InferredValue>>, any>
							: never
					)
				: []
		),
	]
	: GenericTuple;

