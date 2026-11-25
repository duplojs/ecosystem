import { WorkflowEffect } from '../base';
import type * as DCommon from '../../../../common';
import type * as DEither from '../../../../either';
import type * as DKind from '../../../../kind';
export declare const workflowEffectBreakIfLeftKind: DKind.Handler<DKind.Definition<"@DuplojsLangInvocation/workflow-effect-break-if-left", DEither.Left<string, unknown> | DEither.Right<string, unknown>>>;
export interface WorkflowEffectBreakIfLeft<GenericInput extends DEither.Left | DEither.Right = DEither.Left | DEither.Right> extends DCommon.Forward<DKind.Kind<typeof workflowEffectBreakIfLeftKind, GenericInput> & WorkflowEffect<"break-if-left">> {
}
export declare function workflowBreakIfLeftGenerator<GenericInput extends DEither.Left | DEither.Right>(input: GenericInput): Generator<WorkflowEffectBreakIfLeft<GenericInput>, DEither.GetValue<Extract<GenericInput, DEither.Right>>>;
