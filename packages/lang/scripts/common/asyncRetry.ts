import { timeout } from "./timeout";

interface CreateAsyncRetryOptions {
	maxRetry: number;
	timeToSleep?: number;
}

export function useAsyncRetry<
	GenericOutput extends unknown,
>(
	retryFunction: () => Promise<GenericOutput>,
	shouldRetry: (result: GenericOutput) => boolean,
	options: CreateAsyncRetryOptions,
): Promise<GenericOutput>;

export async function useAsyncRetry<
	GenericOutput extends unknown,
>(
	retryFunction: (count: number) => Promise<GenericOutput>,
	shouldRetry: (result: GenericOutput) => boolean,
	options: CreateAsyncRetryOptions,
): Promise<GenericOutput> {
	for (let currentTry = 1; true; currentTry++) {
		const result = await retryFunction(currentTry);

		if (
			currentTry >= options.maxRetry
			|| !shouldRetry(result)
		) {
			return result;
		}

		if (options.timeToSleep) {
			await timeout(options.timeToSleep);
		}
	}
}

export function createAsyncRetry<
	GenericRetryFunction extends (...args: any[]) => Promise<any>,
>(
	retryFunction: GenericRetryFunction,
	checkFunction: (result: Awaited<ReturnType<GenericRetryFunction>>) => boolean,
	options: CreateAsyncRetryOptions,
): GenericRetryFunction;

export function createAsyncRetry(
	retryFunction: (...args: any[]) => Promise<unknown>,
	checkFunction: (result: unknown) => boolean,
	options: CreateAsyncRetryOptions,
) {
	const safeRetryFunction = retryFunction as (...args: unknown[]) => Promise<unknown>;

	return (
		(...args: unknown[]) => useAsyncRetry(
			() => safeRetryFunction(...args),
			checkFunction,
			options,
		)
	);
}
