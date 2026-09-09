import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DObject from "@scripts/object";
import { isLeft, type Left } from "../left";
import type { Right } from "./create";
import { success, type Success } from "./success";
import { whenIsRight } from "./when";
import type { GetValue } from "../types";

type Either = Right | Left;

type ComputeResult<
	GenericGroup extends (
		| Record<string, DCommon.MayBeGetter<Either>>
		| readonly DCommon.MayBeGetter<Either>[]
	),
> = (
	| Success<
		DCommon.SimplifyTopLevel<{
			-readonly [Prop in keyof GenericGroup]: GenericGroup[Prop] extends infer InferredValue
				? InferredValue extends DCommon.AnyFunction
					? GetValue<
						Extract<
							ReturnType<InferredValue>,
							Right
						>
					>
					: GetValue<
						Extract<
							InferredValue,
							Right
						>
					>
				: never
		}>
	>
	| (
		GenericGroup extends readonly (infer InferredElement)[]
			? InferredElement extends DCommon.AnyFunction
				? Extract<
					ReturnType<InferredElement>,
					Left
				>
				: Extract<
					InferredElement,
					Left
				>
			: {
				[Prop in Exclude<keyof GenericGroup, keyof any[]>]: GenericGroup[Prop] extends DCommon.AnyFunction
					? Extract<
						ReturnType<GenericGroup[Prop]>,
						Left
					>
					: Extract<
						GenericGroup[Prop],
						Left
					>
			}[Exclude<keyof GenericGroup, keyof any[]>]
	)
);

export function group<
	const GenericGroup extends(
		| Record<string, DCommon.MayBeGetter<Either>>
		| readonly DCommon.MayBeGetter<Either>[]
	),
>(
	group: GenericGroup,
): Extract<
	ComputeResult<GenericGroup>,
	any
> {
	if (group instanceof Array) {
		return DCommon.pipe(
			group as readonly DCommon.MayBeGetter<Either>[],
			DArray.reduce(
				DArray.reduceFrom<unknown[]>([]),
				({ element, lastValue, nextPush, exit }) => DCommon.pipe(
					element,
					DCommon.when(
						DCommon.isType("function"),
						(getter) => getter(),
					),
					DCommon.when(
						isLeft,
						exit,
					),
					whenIsRight(
						(data) => nextPush(
							lastValue,
							data,
						),
					),
				),
			),
			DCommon.whenNot(
				isLeft,
				success,
			),
		) as never;
	}

	return DCommon.pipe(
		group as Record<string, DCommon.MayBeGetter<Either>>,
		DObject.entries,
		DArray.reduce(
			DArray.reduceFrom<Record<string, unknown>>({}),
			({ element: [key, value], lastValue, nextWithObject, exit }) => DCommon.pipe(
				value,
				DCommon.when(
					DCommon.isType("function"),
					(getter) => getter(),
				),
				DCommon.when(
					isLeft,
					exit,
				),
				whenIsRight(
					(data) => nextWithObject(
						lastValue,
						{ [key]: data },
					),
				),
			),
		),
		DCommon.whenNot(
			isLeft,
			success,
		),
	) as never;
}
