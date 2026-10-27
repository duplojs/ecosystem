import { extractStepKind, processStepKind, stepIdentifier, type Steps } from "@core/steps";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DObject from "@duplojs/lang/object";
import type { EntrypointKey, OpenApiEndpointContract } from "./types";
import { defaultExtractEndpointContractMetadata, IgnoreByOpenApiGeneratorMetadata, OpenApiEndpointContractMetadata } from "./metadata";
import * as DCommon from "@duplojs/lang/common";
import { type Metadata } from "@core/metadata";

export type EntrypointReduceResult = Record<
	EntrypointKey,
	DDataStructure.Structure | Record<string, DDataStructure.Structure>
>;

export interface AggregateStepsResult {
	entrypointContract: EntrypointReduceResult;
	endpointContract: readonly OpenApiEndpointContract[];
}

export interface AggregateStepsParams {
	readonly metadata?: readonly Metadata[];
	readonly defaultExtractMetadata?: ReturnType<typeof OpenApiEndpointContractMetadata>;
}

export function aggregateStepContract(
	steps: readonly Steps[],
	params: AggregateStepsParams = {},
): AggregateStepsResult {
	const filteredStep = DArray.filter(
		steps,
		(step) => DArray.find(
			step.definition.metadata,
			IgnoreByOpenApiGeneratorMetadata.is,
		) === undefined,
	);

	const processContracts = DCommon.pipe(
		filteredStep,
		DArray.filter(stepIdentifier(processStepKind)),
		DArray.filter(
			(step) => DArray.find(
				step.definition.process.definition.metadata,
				IgnoreByOpenApiGeneratorMetadata.is,
			) === undefined,
		),
		DArray.map(
			(element) => aggregateStepContract(
				element.definition.process.definition.steps,
				{
					...params,
					metadata: element.definition.process.definition.metadata,
				},
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
								{
									...accumulatorValue,
									...currentExtractStructure.definition.shape,
								},
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
		DArray.flatMap((step) => (
			extractStepKind.has(step)
			&& !DArray.find(step.definition.metadata, OpenApiEndpointContractMetadata.is)
				? [...step.definition.metadata, params.defaultExtractMetadata ?? defaultExtractEndpointContractMetadata]
				: step.definition.metadata
		)),
		DArray.concat(params.metadata ?? []),
		DArray.filter(
			(metadata): metadata is ReturnType<typeof OpenApiEndpointContractMetadata> => (
				OpenApiEndpointContractMetadata.is(metadata)
			),
		),
		DArray.flatMap((metadata) => DArray.coalescing(OpenApiEndpointContractMetadata.getValue(metadata))),
		DArray.concat(processContracts.endpointContract),
	);

	return {
		entrypointContract,
		endpointContract,
	};
}
