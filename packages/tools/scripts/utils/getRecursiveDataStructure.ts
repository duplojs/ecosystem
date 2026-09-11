import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPattern from "@duplojs/lang/pattern";
import * as DKind from "@duplojs/lang/kind";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DModeling from "@duplojs/lang/modeling";

export function getRecursiveDataStructure(
	structure: DDataStructure.Structures,
) {
	const countMap = new Map<DDataStructure.Structure, number>();

	void (function countDataStructure(structure: DDataStructure.Structures) {
		DPattern.match(structure)
			.when(
				DKind.hasSome([
					DDataStructure.typeStructureKind,
					DDataStructure.recordStructureKind,
					DDataStructure.nonEncodableStringStructureKind,
				]),
				() => void 0,
			)
			.when(
				DDataStructure.lazyStructureKind.has,
				(structure) => {
					const count = (countMap.get(structure) ?? 0) + 1;

					countMap.set(
						structure,
						count,
					);

					if (count > 1) {
						return;
					}

					countDataStructure(structure.definition.getter.value);

					if (countMap.get(structure) === 1) {
						countMap.delete(structure);
					}
				},
			)
			.when(
				DDataStructure.unionStructureKind.has,
				(structure) => {
					const count = (countMap.get(structure) ?? 0) + 1;

					countMap.set(
						structure,
						count,
					);

					if (count > 1) {
						return;
					}

					DArray.map(
						structure.definition.values.value,
						countDataStructure,
					);

					if (countMap.get(structure) === 1) {
						countMap.delete(structure);
					}
				},
			)
			.when(
				DDataStructure.arrayStructureKind.has,
				(structure) => {
					const count = (countMap.get(structure) ?? 0) + 1;

					countMap.set(
						structure,
						count,
					);

					if (count > 1) {
						return;
					}

					countDataStructure(structure.definition.element);

					if (countMap.get(structure) === 1) {
						countMap.delete(structure);
					}
				},
			)
			.when(
				DDataStructure.objectStructureKind.has,
				(structure) => {
					const count = (countMap.get(structure) ?? 0) + 1;

					countMap.set(
						structure,
						count,
					);

					if (count > 1) {
						return;
					}

					DArray.map(
						structure.definition.shape.value,
						(entry) => void countDataStructure(entry.value),
					);

					if (countMap.get(structure) === 1) {
						countMap.delete(structure);
					}
				},
			)
			.when(
				DKind.hasSome([
					DModeling.newTypeStructureKind,
					DModeling.entityStructureKind,
					DModeling.taggedObjectStructureKind,
				]),
				(structure) => void countDataStructure(
					DDataStructure.structureKind.has(structure.definition.inner)
						? structure.definition.inner
						: structure.definition.inner.value,
				),
			)
			.when(
				DDataStructure.structureKind.has,
				() => void 0,
			)
			.exhaustive();
	})(structure);

	return DCommon.pipe(
		countMap.entries(),
		DGenerator.filter(([_key, value]) => value > 1),
		DGenerator.map(([key, _value]) => key),
		DArray.from,
	);
}
