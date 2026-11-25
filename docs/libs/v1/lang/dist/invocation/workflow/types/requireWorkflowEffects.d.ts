import { Effect } from '../effects';
import type * as DCommon from '../../../common';
export type RequireWorkflowEffects<GenericWorkflow extends DCommon.AnyFunction<any[], Generator<any>>> = ReturnType<GenericWorkflow> extends Generator<Effect> ? unknown : DCommon.ComputedTypeError<"Workflow must only yield supported effects.">;
