import { Floor } from '../../types';
import { Request } from '../../request';
import { Response } from '../../response';
import type * as DCommon from "@duplojs-v1/lang/common";
export type BuildedStep = (request: Request, floor: Floor) => DCommon.MaybePromise<Floor | Response>;
