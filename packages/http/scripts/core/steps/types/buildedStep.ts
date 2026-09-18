import { type Floor } from "@core/types";
import { type Request } from "@core/request";
import { type Response } from "@core/response";
import type * as DCommon from "@duplojs/lang/common";

export type BuildedStep = (request: Request, floor: Floor) => DCommon.MaybePromise<Floor | Response>;
