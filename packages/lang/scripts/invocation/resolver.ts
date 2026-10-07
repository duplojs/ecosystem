import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import * as DEither from "@scripts/either";
import { createKind } from "./kind";

export const resolverKind = createKind("resolver");

export interface Resolver<
	GenericValue extends unknown = unknown,
	GenericSubscribers extends Record<string, (value: GenericValue) => unknown> =
		Record<string, (value: GenericValue) => unknown>,
> extends DKind.Kind<typeof resolverKind> {
	runAndResolve<
		GenericOutput extends DCommon.MaybePromise<
			| DEither.Right
			| DEither.Left
			| undefined
			| DCommon.EscapeVoid
		>,
		const GenericWrapperSubscribers extends GenericSubscribers,
		GenericOutputHandlerLeft extends unknown = never,
	>(
		theFunction: (
			value: GenericValue,
		) => GenericOutput,
		subscribers: GenericWrapperSubscribers,
		...args: (
			DCommon.ContainExtends<
				Extract<
					| Awaited<GenericOutput>
					| Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
					DEither.Left
				>,
				DEither.Left
			> extends true
				? [
					whenLeft: (
						result: Extract<
							| Awaited<GenericOutput>
							| Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
							DEither.Left
						>,
						value: GenericValue,
					) => GenericOutputHandlerLeft,
				]
				: []
		)
	): Promise<
		| (
			DCommon.IsNever<GenericOutputHandlerLeft> extends true
				? never
				: DEither.Left<"resolve-error", Awaited<GenericOutputHandlerLeft>>
		)
		| DEither.Right<"resolve-success", GenericValue>
	>;

	resolve<
		const GenericWrapperSubscribers extends GenericSubscribers,
		GenericOutputHandlerLeft extends unknown = never,
	>(
		subscribers: GenericWrapperSubscribers,
		...args: (
			DCommon.ContainExtends<
				Extract<
					Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
					DEither.Left
				>,
				DEither.Left
			> extends true
				? [
					whenLeft: (
						result: Extract<
							Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
							DEither.Left
						>,
						value: GenericValue,
					) => GenericOutputHandlerLeft,
				]
				: []
		)
	): Promise<
		| (
			DCommon.IsNever<GenericOutputHandlerLeft> extends true
				? never
				: DEither.Left<"resolve-error", Awaited<GenericOutputHandlerLeft>>
		)
		| DEither.Right<"resolve-success", GenericValue>
	>;
}

export function createResolver<
	const GenericValue extends unknown,
>(
	value: GenericValue,
): <
	GenericSubscribers extends (
		| Record<string, (value: GenericValue) => unknown>
		| DCommon.AnyTuple<string>
	),
>() => Resolver<
	GenericValue,
	GenericSubscribers extends readonly string[]
		? Record<GenericSubscribers[number], (value: GenericValue) => unknown>
		: GenericSubscribers
> {
	function resolve(
		subscribers: Record<string, DCommon.AnyFunction>,
		whenError: DCommon.AnyFunction,
	) {
		return Promise
			.resolve()
			.then(
				() => Object
					.values(subscribers)
					.reduce(
						(accumulator, element) => DCommon.callThen(
							accumulator,
							(awaitedAccumulator) => {
								if (DEither.isLeft(awaitedAccumulator)) {
									return awaitedAccumulator;
								}
								return element(value);
							},
						),
						null,
					),
			)
			.then(
				(result) => {
					if (DEither.isLeft(result)) {
						return DCommon.callThen(
							whenError(result, value),
							(output) => DEither.left("resolve-error", output),
						);
					}

					return DEither.right("resolve-success", value);
				},
			);
	}

	function runAndResolve(
		theFunction: DCommon.AnyFunction,
		subscribers: Record<string, DCommon.AnyFunction>,
		whenError: DCommon.AnyFunction,
	) {
		return Promise
			.resolve()
			.then(() => theFunction(value))
			.then(
				(result) => {
					if (DEither.isLeft(result)) {
						return DCommon.callThen(
							whenError(result, value),
							(output) => DEither.left("resolve-error", output),
						);
					}

					return resolve(subscribers, whenError);
				},
			);
	}

	return () => (
		{
			resolve,
			runAndResolve,
			[resolverKind.runTimeKey]: null,
		} satisfies Record<keyof DKind.Remove<Resolver>, unknown> as never
	);
}
