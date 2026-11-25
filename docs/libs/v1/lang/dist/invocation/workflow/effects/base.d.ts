import { WorkflowEffectBreakIfLeft, WorkflowEffectCommit, WorkflowEffectResolve, WorkflowEffectIterate } from './defaults';
import type * as DKind from '../../../kind';
export declare const workflowEffectKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/workflow-effect", string>>;
export interface WorkflowEffect<GenericName extends string = string> extends DKind.Kind<typeof workflowEffectKind, GenericName> {
}
export type Effect = (WorkflowEffectResolve | WorkflowEffectCommit | WorkflowEffectBreakIfLeft | WorkflowEffectIterate);
