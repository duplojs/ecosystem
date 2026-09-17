import type * as DDataStructure from "@duplojs/lang/dataStructure";

export interface ResearcherParams {
	find(structure: DDataStructure.Structure): void;
}

export function createResearcher<
	GenericPredicate extends DDataStructure.Structure,
>(
	predicate: (structure: DDataStructure.Structure) => structure is GenericPredicate,
	researcher: (structure: GenericPredicate, params: ResearcherParams) => void,
): (structure: DDataStructure.Structure, params: ResearcherParams) => void;

export function createResearcher(
	predicate: (structure: DDataStructure.Structure) => boolean,
	researcher: (structure: DDataStructure.Structure, params: ResearcherParams) => void,
): (structure: DDataStructure.Structure, params: ResearcherParams) => void;

export function createResearcher(
	predicate: (structure: DDataStructure.Structure) => boolean,
	researcher: (structure: DDataStructure.Structure, params: ResearcherParams) => void,
) {
	return (
		structure: DDataStructure.Structure,
		params: ResearcherParams,
	) => {
		if (predicate(structure)) {
			researcher(structure, params);
		}
	};
}
