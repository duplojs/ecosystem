/* eslint-disable @typescript-eslint/max-params */
import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import type * as DKind from "@scripts/kind";
import { type FlowControllerExit, type FlowController, type FlowControllerResult, flowControllerExitKind, type FlowControllerPreviousFunctionResult, flowControllerKind, type UnwrapFlowControllerResult, type FlowControllerHooks } from "./controller";

type ComputeLastUsableValue<
	GenericAccumulator extends DCommon.AnyTuple,
> = GenericAccumulator extends [
	...infer InferredRest,
	infer InferredLast,
]
	? InferredLast extends FlowControllerResult<infer InferredFlowControllerResult>
		? Exclude<
			Awaited<InferredFlowControllerResult>,
			| FlowControllerPreviousFunctionResult
			| FlowControllerExit
		> extends infer InferredOutputValue
			? DCommon.HasSomething<InferredOutputValue> extends true
				? InferredOutputValue
				: InferredRest extends DCommon.AnyTuple
					? ComputeLastUsableValue<InferredRest>
					: never
			: never
		: InferredLast
	: never;

type Pipe<
	GenericAccumulator extends DCommon.AnyTuple,
	GenericOutput extends unknown,
> = (
	this: never,
	input: Awaited<ComputeLastUsableValue<GenericAccumulator>>,
	argument: GenericAccumulator[0],
) => GenericOutput;

type ComputeTypeOutput<
	GenericAccumulator extends DCommon.AnyTuple,
> = Promise<
	Awaited<
		| ComputeLastUsableValue<GenericAccumulator>
		| (
			Awaited<UnwrapFlowControllerResult<GenericAccumulator[number]>> extends infer InferredResult
				? InferredResult extends FlowControllerExit
					? DKind.GetValue<
						typeof flowControllerExitKind,
						InferredResult
					>
					: never
				: never
		)
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
	const GenericOutput10 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
	pipe10: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
		],
		GenericOutput10
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
				GenericOutput10,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
	const GenericOutput10 extends unknown,
	const GenericOutput11 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
	pipe10: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
		],
		GenericOutput10
	>,
	pipe11: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
		],
		GenericOutput11
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
				GenericOutput10,
				GenericOutput11,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
	const GenericOutput10 extends unknown,
	const GenericOutput11 extends unknown,
	const GenericOutput12 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
	pipe10: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
		],
		GenericOutput10
	>,
	pipe11: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
		],
		GenericOutput11
	>,
	pipe12: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
		],
		GenericOutput12
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
				GenericOutput10,
				GenericOutput11,
				GenericOutput12,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
	const GenericOutput10 extends unknown,
	const GenericOutput11 extends unknown,
	const GenericOutput12 extends unknown,
	const GenericOutput13 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
	pipe10: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
		],
		GenericOutput10
	>,
	pipe11: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
		],
		GenericOutput11
	>,
	pipe12: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
		],
		GenericOutput12
	>,
	pipe13: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
			GenericOutput12,
		],
		GenericOutput13
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
				GenericOutput10,
				GenericOutput11,
				GenericOutput12,
				GenericOutput13,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
	const GenericOutput10 extends unknown,
	const GenericOutput11 extends unknown,
	const GenericOutput12 extends unknown,
	const GenericOutput13 extends unknown,
	const GenericOutput14 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
	pipe10: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
		],
		GenericOutput10
	>,
	pipe11: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
		],
		GenericOutput11
	>,
	pipe12: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
		],
		GenericOutput12
	>,
	pipe13: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
			GenericOutput12,
		],
		GenericOutput13
	>,
	pipe14: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
			GenericOutput12,
			GenericOutput13,
		],
		GenericOutput14
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
				GenericOutput10,
				GenericOutput11,
				GenericOutput12,
				GenericOutput13,
				GenericOutput14,
			]
		>,
		any
	>
>;

export function flow<
	const GenericInput extends unknown,
	const GenericOutput1 extends unknown,
	const GenericOutput2 extends unknown,
	const GenericOutput3 extends unknown,
	const GenericOutput4 extends unknown,
	const GenericOutput5 extends unknown,
	const GenericOutput6 extends unknown,
	const GenericOutput7 extends unknown,
	const GenericOutput8 extends unknown,
	const GenericOutput9 extends unknown,
	const GenericOutput10 extends unknown,
	const GenericOutput11 extends unknown,
	const GenericOutput12 extends unknown,
	const GenericOutput13 extends unknown,
	const GenericOutput14 extends unknown,
	const GenericOutput15 extends unknown,
>(
	pipe1: Pipe<
		[
			GenericInput,
		],
		GenericOutput1
	>,
	pipe2: Pipe<
		[
			GenericInput,
			GenericOutput1,
		],
		GenericOutput2
	>,
	pipe3: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
		],
		GenericOutput3
	>,
	pipe4: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
		],
		GenericOutput4
	>,
	pipe5: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
		],
		GenericOutput5
	>,
	pipe6: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
		],
		GenericOutput6
	>,
	pipe7: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
		],
		GenericOutput7
	>,
	pipe8: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
		],
		GenericOutput8
	>,
	pipe9: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
		],
		GenericOutput9
	>,
	pipe10: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
		],
		GenericOutput10
	>,
	pipe11: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
		],
		GenericOutput11
	>,
	pipe12: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
		],
		GenericOutput12
	>,
	pipe13: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
			GenericOutput12,
		],
		GenericOutput13
	>,
	pipe14: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
			GenericOutput12,
			GenericOutput13,
		],
		GenericOutput14
	>,
	pipe15: Pipe<
		[
			GenericInput,
			GenericOutput1,
			GenericOutput2,
			GenericOutput3,
			GenericOutput4,
			GenericOutput5,
			GenericOutput6,
			GenericOutput7,
			GenericOutput8,
			GenericOutput9,
			GenericOutput10,
			GenericOutput11,
			GenericOutput12,
			GenericOutput13,
			GenericOutput14,
		],
		GenericOutput15
	>,
): (input: GenericInput) => DCommon.BreakGenericLink<
	Extract<
		ComputeTypeOutput<
			[
				GenericInput,
				GenericOutput1,
				GenericOutput2,
				GenericOutput3,
				GenericOutput4,
				GenericOutput5,
				GenericOutput6,
				GenericOutput7,
				GenericOutput8,
				GenericOutput9,
				GenericOutput10,
				GenericOutput11,
				GenericOutput12,
				GenericOutput13,
				GenericOutput14,
				GenericOutput15,
			]
		>,
		any
	>
>;

export function flow(
	...args: (DCommon.AnyFunction<[any, any]> | FlowController<any, any>)[]
): any {
	const accumulateFunction = args.reduce<DCommon.AnyFunction<[any, any, FlowControllerHooks]>>(
		(accumulator, currentValue) => {
			if (flowControllerKind.has(currentValue)) {
				return (input, argument, hooks) => currentValue.exec(
					() => accumulator(input, argument, hooks),
					hooks,
				);
			} else {
				const preparedResultTreatment = (result: any, argument: any) => flowControllerExitKind.has(result)
					? result
					: currentValue(result, argument);
				return (input, argument, hooks) => DCommon.callThen(
					accumulator(input, argument, hooks),
					(result) => preparedResultTreatment(result, argument),
				);
			}
		},
		DCommon.forward,
	);

	const preparedResultTreatment = (result: any) => flowControllerExitKind.has(result)
		? flowControllerExitKind.getValue(result)
		: result;
	return (input: unknown) => {
		let flowEndCallbacks: readonly (() => void)[] = [];
		const hooks: FlowControllerHooks = {
			onFlowEnd: (callback) => {
				flowEndCallbacks = DArray.push(flowEndCallbacks, callback);
			},
		};
		const emitFlowEnd = () => {
			const callbacks = flowEndCallbacks;
			flowEndCallbacks = [];
			for (const callback of callbacks) {
				callback();
			}
		};
		return DCommon.callThen(
			() => accumulateFunction(input, input, hooks),
			(result) => {
				emitFlowEnd();
				return Promise.resolve(preparedResultTreatment(result));
			},
			(error) => new Promise((_resolve, reject) => {
				emitFlowEnd();
				reject(error as Error);
			}),
		);
	};
}
