import type * as DObject from "@duplojs/lang/object";

export interface HostCustom {}

export type Hosts = DObject.GetPropsWithValue<
	HostCustom,
	true
>;
