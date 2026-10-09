import { ResponseCode } from '../../../core/response';
import { EntrypointParameter, EntrypointRequestBody } from './entrypoint';
import { EndpointResponse } from './endpointResponse';
export interface OpenApiOperation {
    parameters?: readonly EntrypointParameter[];
    requestBody?: EntrypointRequestBody;
    responses: Partial<Record<ResponseCode, EndpointResponse>>;
}
