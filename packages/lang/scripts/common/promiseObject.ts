import type { AnyValue, MaybePromise, SimplifyTopLevel } from "./types";

export type AwaitedPromiseObject<
	GenericObject extends Record<string, MaybePromise<unknown>>,
> = {
	[Prop in keyof GenericObject]: Awaited<GenericObject[Prop]>
};

export function promiseObject<
	GenericValue extends AnyValue,
	GenericObject extends Record<string, MaybePromise<GenericValue>>,
>(
	input: GenericObject,
): Promise<SimplifyTopLevel<AwaitedPromiseObject<GenericObject>>>;

export function promiseObject(
	input: Record<string, MaybePromise<unknown>>,
) {
	return Promise
		.all(
			Object.entries(input)
				.map<MaybePromise<[string, unknown]>>(
					([key, promisedValue]) => promisedValue instanceof Promise
						? promisedValue.then((value) => [key, value])
						: [key, promisedValue],
				),
		)
		.then(
			(entries) => Object.fromEntries(entries),
		);
}
