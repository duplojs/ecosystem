import { Request } from '../../../core/request';
import { Response } from '../../../core/response';
export declare const maxAgeFunction: {
    default(maxAge: string): (request: Request, response: Response) => void;
};
