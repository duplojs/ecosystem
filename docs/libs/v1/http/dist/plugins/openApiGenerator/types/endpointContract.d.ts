import { ResponseCode, SuccessResponseCode } from '../../../core/response';
import type * as DDataStructure from "@duplojs/lang/dataStructure";
export interface OpenApiEndpointContractBase {
    readonly code: ResponseCode;
    readonly information: string;
    readonly description?: string;
}
export interface OpenApiResponseEndpointContract extends OpenApiEndpointContractBase {
    readonly type?: "response";
    readonly body?: DDataStructure.Structure;
}
export interface OpenApiServerSentEventsEndpointContract extends OpenApiEndpointContractBase {
    readonly type: "serverSentEvents";
    readonly code: SuccessResponseCode;
    readonly events: Readonly<Record<string, DDataStructure.Structure>>;
}
export interface OpenApiStreamEndpointContract extends OpenApiEndpointContractBase {
    readonly type: "stream";
    readonly code: SuccessResponseCode;
}
export interface OpenApiStreamTextEndpointContract extends OpenApiEndpointContractBase {
    readonly type: "streamText";
    readonly code: SuccessResponseCode;
    readonly flux: DDataStructure.Structure<string>;
}
export type OpenApiEndpointContract = (OpenApiResponseEndpointContract | OpenApiServerSentEventsEndpointContract | OpenApiStreamEndpointContract | OpenApiStreamTextEndpointContract);
