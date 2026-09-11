import * as DDataStructure from "@duplojs/lang/dataStructure";
import type { Typescript } from "@scripts/typescript";
import type { StructureTransformerBuildFunction } from "./structureTransformer";
import type { ConstraintTransformerBuildFunction } from "./constraintTransformer";

declare module "@duplojs/lang/dataStructure" {
	interface StructureDefinition {
		overrideDataStructureTransformer?: StructureTransformerBuildFunction;
	}

	interface Structure {

		/**
		 * @deprecated this method mutated the dataStructure by adding an override transformer
		 */
		setOverrideDataStructureTransformer(
			transformer: (
				| Typescript.CallExpression
				| Typescript.Identifier
				| StructureTransformerBuildFunction<this>
				| null
			),
		): this;
		addOverrideDataStructureTransformer(
			transformer: (
				| Typescript.CallExpression
				| Typescript.Identifier
				| StructureTransformerBuildFunction<this>
				| null
			),
		): this;
	}

	interface ConstraintDefinition {
		overrideConstraintTransformer?: ConstraintTransformerBuildFunction;
	}

	interface Constraint {

		/**
		 * @deprecated this method mutated the constraint by adding an override transformer
		 */
		setOverrideConstraintTransformer(
			transformer: (
				| Typescript.CallExpression
				| Typescript.Identifier
				| ConstraintTransformerBuildFunction<this>
				| null
			),
		): this;
		addOverrideConstraintTransformer(
			transformer: (
				| Typescript.CallExpression
				| Typescript.Identifier
				| ConstraintTransformerBuildFunction<this>
				| null
			),
		): this;
	}
}

DDataStructure.StructureClass.addToPrototype(
	"setOverrideDataStructureTransformer",
	(
		self,
		transformer,
	) => {
		if (transformer) {
			self.definition.overrideDataStructureTransformer = typeof transformer === "function"
				? transformer
				: (__, { success }) => success(transformer);
		} else {
			self.definition.overrideDataStructureTransformer = undefined;
		}

		return self;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addOverrideDataStructureTransformer",
	(
		self,
		transformer,
	) => self.clone().setOverrideDataStructureTransformer(transformer),
);

DDataStructure.ConstraintBase.addToPrototype(
	"setOverrideConstraintTransformer",
	(
		self,
		transformer,
	) => {
		if (transformer) {
			self.definition.overrideConstraintTransformer = typeof transformer === "function"
				? transformer
				: (__, { success }) => success(transformer);
		} else {
			self.definition.overrideConstraintTransformer = undefined;
		}

		return self;
	},
);

DDataStructure.ConstraintBase.addToPrototype(
	"addOverrideConstraintTransformer",
	(
		self,
		transformer,
	) => self.clone().setOverrideConstraintTransformer(transformer),
);
