import { Request } from '../../../core/request';
import { Response } from '../../../core/response';
export declare const allowMethodsFunction: {
    default(methods: string): (request: Request, response: Response) => void;
    isBool(allowMethods: Record<string, string>): (request: Request, response: Response) => void;
};
