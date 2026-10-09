import { Request } from '../../../core/request';
import { Response } from '../../../core/response';
export declare const exposeHeadersFunction: {
    default(exposeHeaders: string): (request: Request, response: Response) => void;
};
