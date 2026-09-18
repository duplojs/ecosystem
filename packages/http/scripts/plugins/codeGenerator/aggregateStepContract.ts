import { checkerStepKind, cutStepKind, extractStepKind, handlerStepKind, presetCheckerStepKind, processStepKind, stepIdentifier, type Steps } from "@core/steps";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DObject from "@duplojs/lang/object";
import * as DPattern from "@duplojs/lang/pattern";
import { type EntrypointKey } from "./types";
import { ResponseContract } from "@core/response";
import { IgnoreByCodeGeneratorMetadata } from "./metadata";
import * as DKind from "@duplojs/lang/kind";
import { Typescript } from "@duplojs/tools";

type EntrypointReduceResult = Record<
	EntrypointKey,
	DDataStructure.Structure | Record<string, DDataStructure.Structure>
>;

export interface StepsToStructureParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export interface StepsToStructureResult {
	entrypointContract: EntrypointReduceResult;
	endpointContract: readonly DDataStructure.Structure[];
}

export const defaultFluxStreamSchema = DDataStructure
	.undefined()
	.setOverrideTypescriptTransformer(
		Typescript.factory.createTypeReferenceNode(
			"Uint8Array",
			[Typescript.factory.createTypeReferenceNode("ArrayBuffer")],
		),
	);

export function aggregateStepContract(
	steps: readonly Steps[],
	params: StepsToStructureParams,
): StepsToStructureResult {
	const filteredStep = DArray.filter(
		steps,
		(step) => DArray.find(
			step.definition.metadata,
			IgnoreByCodeGeneratorMetadata.is,
		) === undefined,
	);

	const processContracts = DCommon.pipe(
		filteredStep,
		DArray.filter(stepIdentifier(processStepKind)),
		DArray.filter(
			(step) => DArray.find(
				step.definition.process.definition.metadata,
				IgnoreByCodeGeneratorMetadata.is,
			) === undefined,
		),
		DArray.map(
			(element) => aggregateStepContract(
				element.definition.process.definition.steps,
				params,
			),
		),
		DObject.to({
			entrypointContract: DArray.map((result) => result.entrypointContract),
			endpointContract: DArray.flatMap((result) => result.endpointContract),
		}),
	);

	const entrypointContract = DCommon.pipe(
		filteredStep,
		DArray.filter(extractStepKind.has),
		DArray.map((extractStep) => extractStep.definition.shape),
		DArray.concat(processContracts.entrypointContract),
		DArray.reduce(
			DArray.reduceFrom<EntrypointReduceResult>({
				body: {},
				headers: {},
				params: {},
				query: {},
			}),
			({ element: shape, lastValue, nextWithObject }) => DCommon.pipe(
				lastValue,
				DObject.entries,
				DArray.map(
					([key, accumulatorValue]) => {
						const currentExtractStructure = shape[key];

						if (
							DDataStructure.structureKind.has(accumulatorValue)
							|| !currentExtractStructure
							|| (
								!DDataStructure.structureKind.has(accumulatorValue)
								&& DObject.countKeys(accumulatorValue) > 1
								&& DDataStructure.structureKind.has(currentExtractStructure)
								&& !DDataStructure.structureIdentifier(
									currentExtractStructure,
									DDataStructure.objectStructureKind,
								)
							)
						) {
							return DObject.entry(key, accumulatorValue);
						}

						if (!DDataStructure.structureKind.has(currentExtractStructure)) {
							return DObject.entry(
								key,
								{
									...accumulatorValue,
									...currentExtractStructure,
								},
							);
						}

						if (
							DDataStructure.structureIdentifier(
								currentExtractStructure,
								DDataStructure.objectStructureKind,
							)
						) {
							return DObject.entry(
								key,
								DObject.override(
									accumulatorValue,
									currentExtractStructure.definition.shape,
								),
							);
						}

						return DObject.entry(key, currentExtractStructure);
					},
				),
				DObject.fromEntries,
				(object) => nextWithObject(lastValue, object),
			),
		),
	);

	const endpointContract = DCommon.pipe(
		filteredStep,
		DArray.flatMap(
			(step) => DPattern.match(step)
				.when(
					processStepKind.has,
					() => [],
				)
				.when(
					extractStepKind.has,
					({ definition }) => definition.responseContract ?? params.defaultExtractContract,
				)
				.when(
					presetCheckerStepKind.has,
					({ definition }) => definition.presetChecker.definition.responseContract,
				)
				.when(
					DKind.hasSome([
						checkerStepKind,
						cutStepKind,
						handlerStepKind,
					]),
					({ definition }) => definition.responseContract,
				)
				.exhaustive(),
		),
		DArray.map(
			DCommon.innerPipe(
				DPattern.when(
					ResponseContract.contractKind.has,
					({ code, information, body }) => DDataStructure.object({
						code: DDataStructure.literal(code),
						information: DDataStructure.literal(information),
						body,
					}),
				),
				DPattern.when(
					ResponseContract.serverSentEventsContractKind.has,
					({ code, information, body, events }) => DDataStructure.object({
						code: DDataStructure.literal(code),
						information: DDataStructure.literal(information),
						body,
						events: DDataStructure.object(events),
					}),
				),
				DPattern.when(
					ResponseContract.streamContractKind.has,
					({ code, information, body }) => DDataStructure.object({
						code: DDataStructure.literal(code),
						information: DDataStructure.literal(information),
						body,
						flux: defaultFluxStreamSchema,
					}),
				),
				DPattern.when(
					ResponseContract.streamTextContractKind.has,
					({ code, information, body, flux }) => DDataStructure.object({
						code: DDataStructure.literal(code),
						information: DDataStructure.literal(information),
						body,
						flux,
					}),
				),
				DPattern.exhaustive,
			),
		),
		DArray.concat(processContracts.endpointContract),
	);

	return {
		entrypointContract,
		endpointContract,
	};
}
