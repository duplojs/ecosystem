import { checkerStepKind, cutStepKind, extractStepKind, handlerStepKind, presetCheckerStepKind, processStepKind, type Steps } from "@core/steps";
import { StructureFinder } from "@duplojs/tools";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DObject from "@duplojs/lang/object";
import * as DPattern from "@duplojs/lang/pattern";
import * as DKind from "@duplojs/lang/kind";

export type IdentifiedStructure = (
	& DDataStructure.Structure
	& { definition: { identifier: string } }
);

export function structureHasIdentifier(
	structure: DDataStructure.Structure,
): structure is IdentifiedStructure {
	return !!structure.definition.identifier;
}

export interface findIdentifiedStructureInStepsParams {
	readonly ignoreStructure: Set<DDataStructure.Structure>;
}

export function findIdentifiedStructureInSteps(
	steps: readonly Steps[],
	params: findIdentifiedStructureInStepsParams,
): readonly IdentifiedStructure[] {
	return DCommon.pipe(
		steps,
		DArray.flatMap(
			DCommon.innerPipe(
				DPattern.when(
					extractStepKind.has,
					(extractStep) => DCommon.pipe(
						extractStep.definition.shape,
						DObject.values,
						DArray.flatMap(
							DCommon.innerPipe(
								DPattern.when(
									DDataStructure.structureKind.has,
									DCommon.forward,
								),
								DPattern.when(
									DCommon.isType("object"),
									DObject.values,
								),
								DPattern.when(
									DCommon.isType("undefined"),
									DCommon.justReturn([]),
								),

								DPattern.exhaustive,
							),
						),
					),
				),
				DPattern.when(
					processStepKind.has,
					DCommon.forward,
				),
				DPattern.when(
					presetCheckerStepKind.has,
					(step) => [step.definition.presetChecker.definition.responseContract.body],
				),
				DPattern.when(
					DKind.hasSome([
						checkerStepKind,
						cutStepKind,
						handlerStepKind,
					]),
					(step) => DCommon.pipe(
						step.definition.responseContract,
						DArray.coalescing,
						DArray.map(
							({ body }) => body,
						),
					),
				),
				DPattern.exhaustive,
			),
		),
		DArray.flatMap(
			DCommon.innerPipe(
				DPattern.when(
					processStepKind.has,
					(processStep) => findIdentifiedStructureInSteps(
						processStep.definition.process.definition.steps,
						params,
					),
				),
				DPattern.when(
					DDataStructure.structureKind.has,
					(structure) => StructureFinder.structureFinder(
						structure,
						structureHasIdentifier,
						{
							researchers: StructureFinder.defaultResearchers,
							ignore: params.ignoreStructure,
						},
					),
				),
				DPattern.exhaustive,
			),
		),
	);
}
