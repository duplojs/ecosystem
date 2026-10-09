interface CreateAsyncRetryOptions {
    maxRetry: number;
    timeToSleep?: number;
}
export declare function useAsyncRetry<GenericOutput extends unknown>(retryFunction: () => Promise<GenericOutput>, shouldRetry: (result: GenericOutput) => boolean, options: CreateAsyncRetryOptions): Promise<GenericOutput>;
export declare function createAsyncRetry<GenericRetryFunction extends (...args: any[]) => Promise<any>>(retryFunction: GenericRetryFunction, checkFunction: (result: Awaited<ReturnType<GenericRetryFunction>>) => boolean, options: CreateAsyncRetryOptions): GenericRetryFunction;
export {};
