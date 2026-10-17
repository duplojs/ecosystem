import { Request } from '../../../core/request';
import { Response } from '../../../core/response';
import type * as DCommon from "@duplojs/lang/common";
export declare const allowOriginFunction: {
    default(allowOrigin: RegExp): (request: Request, response: Response) => void;
    isFunction(allowOrigin: (origin: string) => DCommon.MaybePromise<boolean>): (request: Request, response: Response) => Promise<void>;
};
