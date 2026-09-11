import * as DDataStructure from "@duplojs/lang/dataStructure";
import type { StructureTransformerBuildFunction } from "./structureTransformer";
import type { JsonSchema } from "./result";

export type JsonSchemaTransformerOverride<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = JsonSchema | StructureTransformerBuildFunction<GenericStructure>;

declare module "@duplojs/lang/dataStructure" {
	interface StructureDefinition {
		identifier?: string;
		overrideJsonSchemaTransformer?: StructureTransformerBuildFunction;
	}

	interface Structure {

		/**
		 * @deprecated this method mutated the DataStructure by adding an identifier
		 */
		setIdentifier(identifier: string): this;
		addIdentifier(identifier: string): this;

		/**
		 * @deprecated this method mutated the DataStructure by adding an override transformer
		 */
		setOverrideJsonSchemaTransformer(
			overrideTransformer: JsonSchemaTransformerOverride<this> | null,
		): this;
		addOverrideJsonSchemaTransformer(
			overrideTransformer: JsonSchemaTransformerOverride<this> | null,
		): this;
	}
}

DDataStructure.StructureClass.addToPrototype(
	"setIdentifier",
	(
		self,
		identifier: string,
	) => {
		self.definition.identifier = identifier;

		return self;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addIdentifier",
	(
		self,
		identifier: string,
	) => self.clone().setIdentifier(identifier),
);

DDataStructure.StructureClass.addToPrototype(
	"setOverrideJsonSchemaTransformer",
	(
		self,
		overrideTransformer: JsonSchemaTransformerOverride | null,
	) => {
		if (overrideTransformer === null) {
			self.definition.overrideJsonSchemaTransformer = undefined;
		} else if (typeof overrideTransformer === "function") {
			self.definition.overrideJsonSchemaTransformer = overrideTransformer;
		} else {
			self.definition.overrideJsonSchemaTransformer = (
				_structure,
				{ success },
			) => success(overrideTransformer);
		}

		return self;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addOverrideJsonSchemaTransformer",
	(
		self,
		overrideTransformer: JsonSchemaTransformerOverride | null,
	) => self
		.clone()
		.setOverrideJsonSchemaTransformer(overrideTransformer),
);
