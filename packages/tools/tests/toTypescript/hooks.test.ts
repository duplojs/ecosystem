import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("toTypescript hooks", () => {
	it("chains hooks until stop and caches a shared structure", () => {
		const sourceStructure = DDataStructure.string();
		let firstHookCallCount = 0;
		let secondHookCallCount = 0;
		let stoppedStructureReachedLastHook = false;

		const result = DStoTS.render(
			DDataStructure.object({
				first: sourceStructure,
				second: sourceStructure,
			}),
			{
				identifier: "Hooked",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
				hooks: [
					({ structure, output }) => {
						if (structure === sourceStructure) {
							firstHookCallCount++;
							return output("next", DDataStructure.number());
						}

						return output("next", structure);
					},
					({ structure, importContext, output }) => {
						const isNumberStructure = DDataStructure.structureIdentifier(
							structure,
							DDataStructure.typeStructureKind,
						) && DDataStructure.typeIdentifier(structure.definition.type, DDataStructure.numberTypeKind);

						if (isNumberStructure) {
							secondHookCallCount++;
							importContext.set("hook-package", { direct: ["HookMarker"] });
							return output("stop", DDataStructure.optional(DDataStructure.boolean()));
						}

						return output("next", structure);
					},
					({ structure, output }) => {
						const isNumberStructure = DDataStructure.structureIdentifier(
							structure,
							DDataStructure.typeStructureKind,
						) && DDataStructure.typeIdentifier(structure.definition.type, DDataStructure.numberTypeKind);

						if (isNumberStructure) {
							stoppedStructureReachedLastHook = true;
						}

						return output("next", structure);
					},
				],
			},
		);

		expect(firstHookCallCount).toBe(2);
		expect(secondHookCallCount).toBe(2);
		expect(stoppedStructureReachedLastHook).toBe(false);
		expect(result).toMatchSnapshot();
	});
});
