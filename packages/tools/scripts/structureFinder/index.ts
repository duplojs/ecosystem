import type * as DDataStructure from "@duplojs/lang/dataStructure";
import { type ResearcherParams, type createResearcher } from "./researcher";

export * from "./researcher";

export interface StructureFinderParams {
	readonly researchers: readonly ReturnType<typeof createResearcher>[];
	readonly ignore?: Set<DDataStructure.Structure>;
	readonly continueAfterMatch?: boolean;
}

export function structureFinder<
	GenericPredicate extends DDataStructure.Structure,
>(
	structure: DDataStructure.Structure,
	predicate: (structure: DDataStructure.Structure) => structure is GenericPredicate,
	params: StructureFinderParams,
): readonly GenericPredicate[];

export function structureFinder(
	structure: DDataStructure.Structure,
	predicate: (structure: DDataStructure.Structure) => boolean,
	params: StructureFinderParams,
): readonly DDataStructure.Structure[];

export function structureFinder(
	structure: DDataStructure.Structure,
	predicate: (structure: DDataStructure.Structure) => boolean,
	params: StructureFinderParams,
) {
	const result: DDataStructure.Structure[] = [];
	const ignoreContext = params.ignore ?? new Set<DDataStructure.Structure>();

	if (ignoreContext.has(structure)) {
		return result;
	}

	ignoreContext.add(structure);

	if (predicate(structure)) {
		result.push(structure);

		if (params.continueAfterMatch !== true) {
			return result;
		}
	}

	const researcherParams: ResearcherParams = {
		find(structure) {
			result.push(
				...structureFinder(
					structure,
					predicate,
					{
						...params,
						ignore: ignoreContext,
					},
				),
			);
		},
	};

	for (const researcher of params.researchers) {
		researcher(structure, researcherParams);
	}

	return result;
}
