import { Hub } from '../../../core/hub';
import { HttpServerParams } from '../../../core/types';
export declare function initNodeHook(hub: Hub, serverParams: HttpServerParams): {
    readonly beforeSendResponse: ({ request, currentResponse, exit }: import('../../../core/route').RouteHookParamsAfter) => import('../../../core/route').RouteHookExit;
    readonly sendResponse: ({ request, currentResponse, exit }: import('../../../core/route').RouteHookParamsAfter) => Promise<import('../../../core/route').RouteHookExit>;
    readonly afterSendResponse: ({ request, next }: import('../../../core/route').RouteHookParamsAfter) => Promise<import('../../../core/route').RouteHookNext>;
};
