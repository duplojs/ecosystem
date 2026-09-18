import { createKind } from "@core/kind";
import type * as DKind from "@duplojs/lang/kind";

export const stepKind = createKind("step");

export type StepKind = DKind.Kind<typeof stepKind>;
