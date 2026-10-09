import { RoutePath } from '../../../core/route';
import { OpenApiMethod } from './openApiMethod';
import { OpenApiOperation } from './openApiOperation';
export type OpenApiPath = Record<RoutePath, Partial<Record<OpenApiMethod, OpenApiOperation>> | undefined>;
