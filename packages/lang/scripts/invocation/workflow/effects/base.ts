import type * as DKind from "@scripts/kind";
import { createKind } from "../../kind";
import { type WorkflowEffectBreakIfLeft, type WorkflowEffectCommit, type WorkflowEffectResolve, type WorkflowEffectIterate } from "./defaults";

export const workflowEffectKind = createKind<
	"workflow-effect",
	string
>("workflow-effect");

export interface WorkflowEffect<
	GenericName extends string = string,
> extends DKind.Kind<
	typeof workflowEffectKind,
	GenericName
	> {
}

// <3
export type Effect = (
	| WorkflowEffectResolve
	| WorkflowEffectCommit
	| WorkflowEffectBreakIfLeft
	| WorkflowEffectIterate
);
