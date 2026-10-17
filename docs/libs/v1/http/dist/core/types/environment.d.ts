import type * as DObject from "@duplojs/lang/object";
export interface EnvironmentCustom {
}
export type Environment = (EnvironmentCustom[DObject.GetPropsWithValue<EnvironmentCustom, true>] | "DEV" | "PROD" | "BUILD");
