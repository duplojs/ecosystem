import type * as DCommon from "@duplojs/lang/common";
import { type Hosts } from "./hosts";
import type * as DPath from "@duplojs/lang/path";

export interface HttpServerParams {
	readonly host: Hosts;
	readonly port: number;
	readonly maxBodySize: DCommon.BytesInString | number;
	readonly informationHeaderKey: string;
	readonly predictedHeaderKey: string;
	readonly fromHookHeaderKey: string;
	readonly uploadFolder: string & DPath.Path;
}
