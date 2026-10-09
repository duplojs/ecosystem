import { CreateClientCacheKey, ClientCacheStore } from './clientCache';
import { ClientRequestParams } from './clientRequestParams';
import { Hooks } from './hooks';
export interface PromiseRequestParams<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> extends ClientRequestParams<GenericHookParams> {
    baseUrl: string;
    hooks: Hooks;
    informationHeaderKey: string;
    predictedHeaderKey: string;
    disabledPredicateMode: boolean;
    abortController: AbortController;
    cacheStore: ClientCacheStore;
    clientCache?: CreateClientCacheKey<GenericHookParams>;
}
