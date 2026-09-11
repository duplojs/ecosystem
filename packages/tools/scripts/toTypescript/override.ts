import * as DDataStructure from "@duplojs/lang/dataStructure";
import type { Typescript } from "@scripts/typescript";
import type { AddImport, MapImportContextValue } from "./importContext";
import type { StructureTransformerBuildFunction } from "./structureTransformer";

export type MapImportContextEntry = readonly [
	path: string,
	value: MapImportContextValue,
];

export type TypescriptTransformerOverride<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = Typescript.TypeNode | StructureTransformerBuildFunction<GenericStructure>;

declare module "@duplojs/lang/dataStructure" {
	interface StructureDefinition {
		identifier?: string;
		overrideTypescriptTransformer?: StructureTransformerBuildFunction;
		mapImportContextEntries?: readonly MapImportContextEntry[];
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
		setOverrideTypescriptTransformer(
			overrideTransformer: TypescriptTransformerOverride<this> | null,
		): this;
		addOverrideTypescriptTransformer(
			overrideTransformer: TypescriptTransformerOverride<this> | null,
		): this;

		/**
		 * @deprecated this method mutated the DataStructure by adding an map import context
		 */
		setMapImportContextEntries(
			...entries: readonly MapImportContextEntry[]
		): this;
		addMapImportContextEntries(
			...entries: readonly MapImportContextEntry[]
		): this;
	}
}

export function applyMapImportContextEntries(
	addImport: AddImport,
	entries: readonly MapImportContextEntry[],
): void {
	for (const [path, imports] of entries) {
		for (const identifier of imports.namespace ?? []) {
			addImport(path, identifier, "namespace");
		}

		for (const identifier of imports.default ?? []) {
			addImport(path, identifier, "default");
		}

		for (const identifier of imports.direct ?? []) {
			addImport(path, identifier, "direct");
		}
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
	"setOverrideTypescriptTransformer",
	(
		self,
		overrideTransformer: TypescriptTransformerOverride | null,
	) => {
		if (overrideTransformer === null) {
			self.definition.overrideTypescriptTransformer = undefined;
		} else if (typeof overrideTransformer === "function") {
			self.definition.overrideTypescriptTransformer = overrideTransformer;
		} else {
			self.definition.overrideTypescriptTransformer = (
				_structure,
				{ success },
			) => success(overrideTransformer);
		}

		return self;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addOverrideTypescriptTransformer",
	(
		self,
		overrideTransformer: TypescriptTransformerOverride | null,
	) => self
		.clone()
		.setOverrideTypescriptTransformer(overrideTransformer),
);

DDataStructure.StructureClass.addToPrototype(
	"setMapImportContextEntries",
	(
		self,
		...entries: readonly MapImportContextEntry[]
	) => {
		self.definition.mapImportContextEntries = entries;

		return self;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addMapImportContextEntries",
	(
		self,
		...entries: readonly MapImportContextEntry[]
	) => self
		.clone()
		.setMapImportContextEntries(...entries),
);
