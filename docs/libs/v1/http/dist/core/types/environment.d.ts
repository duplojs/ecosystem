import type * as DObject from "@duplojs-v1/lang/object";
export interface EnvironmentCustom {
}
export type Environment = (EnvironmentCustom[DObject.GetPropsWithValue<EnvironmentCustom, true>] | "DEV" | "PROD" | "BUILD");
