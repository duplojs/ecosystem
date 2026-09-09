import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DEither from "@scripts/either";
import { createKind } from "../../kind";
import { type Evidence } from "../../evidence";

export const flowControllerExitKind = createKind("flow-controller-exit");

export interface FlowControllerExit<
	GenericResult extends unknown = unknown,
> extends DKind.Kind<
		typeof flowControllerExitKind,
		GenericResult
	> {

}

export const flowControllerKind = createKind("flow-controller");

declare const FlowControllerResultSymbol: unique symbol;

export type FlowControllerPreviousFunctionResult = DCommon.MaybePromise<
	(
		| DCommon.AnyValue
		| DEither.Right
		| DEither.Left
		| FlowControllerExit
	) & Evidence<"PreviousFunctionResult">
>;

export interface FlowControllerResult<
	GenericResult extends unknown,
> {
	readonly [FlowControllerResultSymbol]: GenericResult;
}

export type UnwrapFlowControllerResult<
	GenericValue extends unknown,
> = GenericValue extends FlowControllerResult<infer InferredResult>
	? InferredResult
	: GenericValue;

export interface FlowController<
	GenericInput extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> extends DKind.Kind<typeof flowControllerKind> {
	(this: never, input: GenericInput): FlowControllerResult<GenericOutput>;
	exec(
		previousFunction: () => FlowControllerPreviousFunctionResult,
	): (
		| FlowControllerPreviousFunctionResult
		| GenericOutput
		| DCommon.MergePromise<
			| FlowControllerPreviousFunctionResult
			| GenericOutput
		>
	);
}

export interface CreateFlowControllerConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericFlowController extends (
			& FlowController<any, any>
			& DKind.Kind<GenericKindHandler>
		),
	>(
		exec: GenericFlowController["exec"]
	): GenericFlowController;
	exitFlow<
		GenericValue extends unknown,
	>(
		value: GenericValue
	): FlowControllerExit<GenericValue>;
}

export function createFlowController<
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& FlowController<any, any>
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateFlowControllerConstructorParams<
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	return createConstructor({
		init: (
			exec,
		) => ({
			exec,
			[flowControllerKind.runTimeKey]: null,
			[kindHandler.runTimeKey]: null,
		}) satisfies DKind.Remove<FlowController<any, any>> as never,
		exitFlow: (value) => ({
			[flowControllerExitKind.runTimeKey]: value,
		}) as never,
	});
}
