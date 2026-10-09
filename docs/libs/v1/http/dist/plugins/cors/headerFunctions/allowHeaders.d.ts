import { Request } from '../../../core/request';
import { Response } from '../../../core/response';
export declare const allowHeadersFunction: {
    default(allowHeaders: string): (request: Request, response: Response) => void;
};
