import { Hub } from '../hub';
import { Router } from './types';
export type * from './types';
export * from './pathToRegExp';
export * from './buildError';
export * from './notFoundBodyReaderImplementationError';
export * from './createRouterElementSystem';
export declare function createRouter(hub: Hub): Promise<Router>;
