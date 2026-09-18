import type * as DObject from "@duplojs/lang/object";

export interface EnvironmentCustom {}

export type Environment = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| EnvironmentCustom[
		DObject.GetPropsWithValue<
			EnvironmentCustom,
			true
		>
	]
	| "DEV"
	| "PROD"
	| "BUILD"
);
