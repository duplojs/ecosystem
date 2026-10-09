import type * as DCommon from '../common';
export declare function execute<GenericIterator extends AsyncIterable<unknown> | Iterable<unknown>>(iterator: GenericIterator): GenericIterator extends AsyncIterable<unknown> ? Promise<void> : DCommon.EscapeVoid;
