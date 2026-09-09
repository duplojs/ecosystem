import * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";
import * as DGenerator from "@scripts/generator";
import * as DEither from "@scripts/either";

type Either = DCommon.MaybePromise<DEither.Right | DEither.Left>;

type AsyncGroupOutput<
	GenericGroup extends (
		| Record<string, DCommon.MayBeGetter<Either>>
		| readonly DCommon.MayBeGetter<Either>[]
	),
> = Extract<
	Promise<
		| DEither.Success<
			DCommon.SimplifyTopLevel<{
				-readonly [Prop in keyof GenericGroup]: GenericGroup[Prop] extends infer InferredValue
					? InferredValue extends DCommon.AnyFunction
						? DEither.GetValue<
							Extract<
								Awaited<ReturnType<InferredValue>>,
								DEither.Right
							>
						>
						: DEither.GetValue<
							Extract<
								Awaited<InferredValue>,
								DEither.Right
							>
						>
					: never
			}>
		>
		| (
			GenericGroup extends readonly (infer InferredElement)[]
				? InferredElement extends DCommon.AnyFunction
					? Extract<
						Awaited<ReturnType<InferredElement>>,
						DEither.Left
					>
					: Extract<
						Awaited<InferredElement>,
						DEither.Left
					>
				: {
					[Prop in Exclude<keyof GenericGroup, keyof any[]>]: GenericGroup[Prop] extends DCommon.AnyFunction
						? Extract<
							Awaited<ReturnType<GenericGroup[Prop]>>,
							DEither.Left
						>
						: Extract<
							Awaited<GenericGroup[Prop]>,
							DEither.Left
						>
				}[Exclude<keyof GenericGroup, keyof any[]>]
		)
	>,
	any
>;

export function asyncGroup<
	const GenericGroup extends(
		| Record<string, DCommon.MayBeGetter<Either>>
		| readonly DCommon.MayBeGetter<Either>[]
	),
>(
	group: GenericGroup,
): Extract<
	AsyncGroupOutput<GenericGroup>,
	any
> {
	if (group instanceof Array) {
		return DCommon.asyncPipe(
			group as readonly DCommon.MayBeGetter<Either>[],
			DGenerator.asyncReduce(
				DGenerator.reduceFrom<unknown[]>([]),
				({ item, lastValue, nextPush, exit }) => DCommon.asyncPipe(
					item,
					DCommon.when(
						DCommon.isType("function"),
						(getter) => getter(),
					),
					DCommon.when(
						DEither.isLeft,
						exit,
					),
					DEither.whenIsRight(
						(data) => nextPush(
							lastValue,
							data,
						),
					),
				),
			),
			DCommon.whenNot(
				DEither.isLeft,
				DEither.success,
			),
		) as never;
	}

	return DCommon.asyncPipe(
		group as Record<string, DCommon.MayBeGetter<Either>>,
		DObject.entries,
		DGenerator.asyncReduce(
			DGenerator.reduceFrom<Record<string, unknown>>({}),
			({ item: [key, value], lastValue, nextWithObject, exit }) => DCommon.asyncPipe(
				value,
				DCommon.when(
					DCommon.isType("function"),
					(getter) => getter(),
				),
				DCommon.when(
					DEither.isLeft,
					exit,
				),
				DEither.whenIsRight(
					(data) => nextWithObject(
						lastValue,
						{ [key]: data },
					),
				),
			),
		),
		DCommon.whenNot(
			DEither.isLeft,
			DEither.success,
		),
	) as never;
}
