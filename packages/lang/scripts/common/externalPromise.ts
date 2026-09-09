export interface ExternalPromise<
	GenericValue extends unknown,
> {
	resolve(
		value: (
			| Awaited<GenericValue>
			| GenericValue
			| Promise<GenericValue>
		)
	): void;
	reject(value: unknown): void;
	promise: Promise<Awaited<GenericValue>>;
}

export function createExternalPromise<
	GenericPromiseValue extends unknown,
>(): ExternalPromise<GenericPromiseValue> {
	let resolve = undefined as unknown as (_value: unknown) => void;
	let reject = undefined as unknown as (_value: unknown) => void;
	const promise = new Promise<Awaited<GenericPromiseValue>>((res, rej) => {
		resolve = res as never;
		reject = rej;
	});

	return {
		resolve,
		reject,
		promise,
	};
}
