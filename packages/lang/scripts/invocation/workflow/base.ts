import * as DCommon from "@scripts/common";
import * as DGenerator from "@scripts/generator";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import { type Effect, workflowBreakIfLeftGenerator, type WorkflowEffectBreakIfLeft, workflowEffectBreakIfLeftKind, workflowCommitGenerator, type WorkflowEffectCommit, workflowEffectCommitKind, workflowEffectKind, type WorkflowEffectResolve, workflowEffectResolveKind, workflowResolveGenerator, workflowIterateGenerator, type WorkflowEffectIterate, workflowEffectIterateKind } from "./effects";
import * as DArray from "@scripts/array";
import * as DEither from "@scripts/either";
import * as DPattern from "@scripts/pattern";
import type * as DNumber from "@scripts/number";
import type { RequireWorkflowEffects } from "./types";

export interface CreateWorkflowInitParams {
	iterate: typeof workflowIterateGenerator;
	resolve: typeof workflowResolveGenerator;
	commit: typeof workflowCommitGenerator;
	breakIfLeft: typeof workflowBreakIfLeftGenerator;
}

export const createWorkflowInitParams: CreateWorkflowInitParams = {
	iterate: workflowIterateGenerator,
	resolve: workflowResolveGenerator,
	commit: workflowCommitGenerator,
	breakIfLeft: workflowBreakIfLeftGenerator,
};

export function createWorkflow<
	GenericWorkflow extends DCommon.AnyFunction<any[], Generator<any>>,
>(
	init: (
		& ((params: CreateWorkflowInitParams) => GenericWorkflow)
		& RequireWorkflowEffects<NoInfer<GenericWorkflow>>
	),
): GenericWorkflow {
	return init(
		createWorkflowInitParams,
	);
}

type NestedWorkflowEffects<
	GenericEffect extends Effect,
> = Effect extends GenericEffect
	? GenericEffect
	: GenericEffect extends WorkflowEffectIterate
		? GenericEffect | NestedWorkflowEffects<DGenerator.GetItem<ReturnType<GenericEffect["iteratorFunction"]>>>
		: GenericEffect;

type ImplementedEffect = WorkflowEffectCommit | WorkflowEffectResolve | WorkflowEffectIterate;

type IterateItem<
	GenericEffect extends WorkflowEffectIterate,
> = Parameters<GenericEffect["iteratorFunction"]> extends []
	? unknown
	: Parameters<GenericEffect["iteratorFunction"]>[0];

type IterateIterable<
	GenericEffect extends WorkflowEffectIterate,
> = (
	| Iterable<IterateItem<GenericEffect>>
	| AsyncIterable<IterateItem<GenericEffect>>
);

type IterateGetter<
	GenericEffect extends WorkflowEffectIterate,
> = (...args: GenericEffect["input"]) => DCommon.MaybePromise<
	| IterateIterable<GenericEffect>
	| DEither.Left
	| DEither.Right<string, IterateIterable<GenericEffect>>
>;

export interface WorkflowIterateOptions<
	GenericGetter extends DCommon.AnyFunction = DCommon.AnyFunction,
> {
	readonly getIterator: GenericGetter;
	readonly concurrency: number;
}

type EffectImplementationFunction<
	GenericImplementation extends unknown,
> = GenericImplementation extends DCommon.AnyFunction
	? GenericImplementation
	: GenericImplementation extends WorkflowIterateOptions
		? GenericImplementation["getIterator"]
		: never;

type EffectsImplementation<
	GenericEffect extends Effect,
> = Extract<
	{
		[
		WorkflowEffect in Extract<NestedWorkflowEffects<GenericEffect>, ImplementedEffect> as DKind.GetValue<
				typeof workflowEffectKind,
				WorkflowEffect
		>
		]: WorkflowEffect extends WorkflowEffectCommit
			? DKind.GetValue<typeof workflowEffectCommitKind, WorkflowEffect>
			: WorkflowEffect extends WorkflowEffectResolve
				? (...args: DKind.GetValue<typeof workflowEffectResolveKind, WorkflowEffect>["input"]) => DCommon.MaybePromise<
					| DEither.Left
					| DEither.Right<string, DKind.GetValue<typeof workflowEffectResolveKind, WorkflowEffect>["output"]>
				>
				: WorkflowEffect extends WorkflowEffectIterate
					? IterateGetter<WorkflowEffect> | WorkflowIterateOptions<IterateGetter<WorkflowEffect>>
					: never
	},
	Record<string, DCommon.AnyFunction | WorkflowIterateOptions>
>;

type ForbiddenMoreKey<
	GenericEffect extends Effect,
	GenericEffects extends EffectsImplementation<GenericEffect>,
> = DObject.ForbiddenKey<
	GenericEffects,
	Extract<
		Exclude<
			keyof GenericEffects,
			DKind.GetValue<
				typeof workflowEffectKind,
				Extract<NestedWorkflowEffects<GenericEffect>, ImplementedEffect>
			>
		>,
		string | number
	>
>;

type ComputeOutputConsumeWorkflow<
	GenericGenerator extends Generator<Effect>,
	GenericEffects extends EffectsImplementation<
		DGenerator.GetItem<GenericGenerator>
	>,
> = Extract<
	Promise<
		| Awaited<
			DGenerator.GetResult<GenericGenerator>
		>
		| Extract<
			DKind.GetValue<
				typeof workflowEffectBreakIfLeftKind,
				Extract<NestedWorkflowEffects<DGenerator.GetItem<GenericGenerator>>, WorkflowEffectBreakIfLeft>
			>,
			DEither.Left
		>
		| Extract<
			Awaited<DGenerator.GetResult<ReturnType<
				Extract<NestedWorkflowEffects<DGenerator.GetItem<GenericGenerator>>, WorkflowEffectIterate>["iteratorFunction"]
			>>>,
			DEither.Left
		>
		| Extract<
			Awaited<
				ReturnType<
					EffectImplementationFunction<GenericEffects[keyof GenericEffects]>
				>
			>,
			DEither.Left
		>
	>,
	any
>;

export async function consumeWorkflow<
	GenericGenerator extends Generator<Effect>,
	GenericEffects extends EffectsImplementation<
		DGenerator.GetItem<GenericGenerator>
	>,
>(
	generator: GenericGenerator,
	effects: (
		& DCommon.FixDeepFunctionInfer<
			EffectsImplementation<
				DGenerator.GetItem<GenericGenerator>
			>,
			GenericEffects
		>
		& ForbiddenMoreKey<DGenerator.GetItem<NoInfer<GenericGenerator>>, GenericEffects>
	),
): ComputeOutputConsumeWorkflow<
	GenericGenerator,
	GenericEffects
> {
	return DCommon.asyncLoop(
		async({ next, exit, previousOutput }: DCommon.LoopParams<Effect>) => {
			const result = await DCommon.pipe(
				previousOutput,
				DPattern.when(
					DCommon.isType("undefined"),
					() => generator.next(),
				),
				DPattern.when(
					workflowEffectBreakIfLeftKind.has,
					(effect): ReturnType<typeof generator.next> => {
						const input = workflowEffectBreakIfLeftKind.getValue(effect);

						if (DEither.isLeft(input)) {
							generator.return(undefined);

							return {
								done: true,
								value: input,
							};
						}

						return generator.next(DEither.unwrapRight(input));
					},
				),
				DPattern.when(
					workflowEffectCommitKind.has,
					async(effect): Promise<ReturnType<typeof generator.next>> => {
						const name = workflowEffectKind.getValue(effect);
						const implementation = effects[name as keyof typeof effects] as DCommon.AnyFunction<
							unknown[],
							unknown
						>;
						const output = await implementation(...effect.input as unknown[]);

						if (DEither.isLeft(output)) {
							generator.return(undefined);

							return {
								done: true,
								value: output,
							};
						}

						return generator.next();
					},
				),
				DPattern.when(
					workflowEffectResolveKind.has,
					async(effect): Promise<ReturnType<typeof generator.next>> => {
						const name = workflowEffectKind.getValue(effect);
						const implementation = effects[name as keyof typeof effects] as DCommon.AnyFunction<
							unknown[],
							unknown
						>;
						const output = await implementation(...effect.input);

						if (DEither.isLeft(output)) {
							generator.return(undefined);

							return {
								done: true,
								value: output,
							};
						}

						return generator.next(DEither.unwrapRight(output));
					},
				),
				DPattern.when(
					workflowEffectIterateKind.has,
					async(effect): Promise<ReturnType<typeof generator.next>> => {
						const name = workflowEffectKind.getValue(effect);
						const implementation = effects[name as keyof typeof effects] as (
							| IterateGetter<WorkflowEffectIterate>
							| WorkflowIterateOptions<IterateGetter<WorkflowEffectIterate>>
						);
						const { getIterator, concurrency = 1 } = DCommon.isType(implementation, "function")
							? { getIterator: implementation }
							: implementation;
						const output = await getIterator(...effect.input);

						if (DEither.isLeft(output)) {
							generator.return(undefined);

							return {
								done: true,
								value: output,
							};
						}

						const chunks = DCommon.pipe(
							output,
							DEither.unwrapRight,
							DGenerator.asyncChunk(concurrency),
							DGenerator.asyncMap(
								DCommon.innerPipe(
									DArray.map(
										async(item) => consumeWorkflow(
											effect.iteratorFunction(item),
											effects as never,
										),
									),
									DCommon.promiseAll,
								),
							),
						);

						try {
							for await (const chunk of chunks) {
								const failure = DArray.find(chunk, DEither.isLeft);

								if (failure) {
									generator.return(undefined);
									await chunks.return(undefined);

									return {
										done: true,
										value: failure,
									};
								}
							}
						} catch (error) {
							try {
								await chunks.return(undefined);
							} catch {}

							throw error;
						}

						return generator.next();
					},
				),
				DPattern.exhaustive,
			);

			if (result.done === true) {
				return exit(result.value);
			}

			return next(result.value);
		},
	)
		.catch((error: Error) => {
			try {
				generator.return(undefined);
			} catch {}

			return Promise.reject(error);
		});
}
