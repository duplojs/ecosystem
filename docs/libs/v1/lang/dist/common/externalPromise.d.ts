export interface ExternalPromise<GenericValue extends unknown> {
    resolve(value: (Awaited<GenericValue> | GenericValue | Promise<GenericValue>)): void;
    reject(value: unknown): void;
    promise: Promise<Awaited<GenericValue>>;
}
export declare function createExternalPromise<GenericPromiseValue extends unknown>(): ExternalPromise<GenericPromiseValue>;
