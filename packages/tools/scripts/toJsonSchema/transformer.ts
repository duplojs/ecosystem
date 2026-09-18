import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type { MapContext } from "./context";
import type { TransformerHook } from "./hook";
import type { SupportedVersions, DataStructureTransformerEither } from "./result";
import { structureTransformer, type StructureTransformerParams, type StructureTransformer } from "./structureTransformer";
import { typeTransformer, type TypeTransformer, type TypeTransformerParams } from "./typeTransformer";

const defaultPlaceholderJsonSchema = { not: {} };
export interface TransformerFunctionParams {
	readonly identifier?: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly context: MapContext;
	readonly hooks: readonly TransformerHook[];
	readonly version: SupportedVersions;
	readonly recursiveDataStructures: readonly DDataStructure.Structure[];
}

export function transformer(
	structure: DDataStructure.Structure,
	params: TransformerFunctionParams,
): DataStructureTransformerEither {
	const currentDataStructure = DArray.reduce(
		params.hooks,
		DArray.reduceFrom< DDataStructure.Structure>(structure),
		({ element: hook, lastValue, next, exit }) => {
			const result = hook({
				structure: lastValue,
				context: params.context,
				output: (action, structure) => ({
					structure,
					action,
				}),
			});

			if (result.action === "stop") {
				return exit(result.structure);
			} else {
				return next(result.structure);
			}
		},
	);

	const currentDeclaration = params.context.get(currentDataStructure);

	if (currentDeclaration) {
		return DEither.right(
			"buildDataStructureSuccess",
			{
				schema: { $ref: buildRef(currentDeclaration.name, params.version) },
				isOptional: currentDeclaration.isOptional,
			},
		);
	}

	const currentDataStructureIsOptional = DDataStructure.isOptional(currentDataStructure);

	const currentIdentifier = DCommon.justExec(() => {
		if (
			!DArray.includes(params.recursiveDataStructures, currentDataStructure)
			&& !currentDataStructure.definition.identifier
		) {
			return undefined;
		}

		const identifier = currentDataStructure.definition.identifier ?? `RecursiveName${params.context.size}`;

		params.context.set(
			currentDataStructure,
			{
				name: identifier,
				schema: defaultPlaceholderJsonSchema,
				isOptional: currentDataStructureIsOptional,
			},
		);

		return identifier;
	});

	const typeTransformerParams: TypeTransformerParams = {
		success(result) {
			return DEither.right("buildDataStructureTypeSuccess", result);
		},
		buildError() {
			return DEither.left("buildDataStructureTypeError");
		},
		version: params.version,
	};

	const structureTransformerParams: StructureTransformerParams = {
		success(schema) {
			return DEither.right("buildDataStructureSuccess", {
				schema,
				isOptional: currentDataStructureIsOptional,
			});
		},
		transformer(structure) {
			return transformer(
				structure,
				params,
			);
		},
		buildError() {
			return DEither.left("buildDataStructureError");
		},
		context: params.context,
		version: params.version,
		transformType(type, constraints) {
			return typeTransformer(
				type,
				constraints,
				{
					transformers: params.typeTransformers,
					transformerParams: typeTransformerParams,
				},
			);
		},
	};
	const result = DCommon.justExec(
		() => {
			if (currentDataStructure.definition.overrideJsonSchemaTransformer) {
				return currentDataStructure.definition.overrideJsonSchemaTransformer(
					currentDataStructure.addOverrideJsonSchemaTransformer(null),
					structureTransformerParams,
				);
			} else {
				return structureTransformer(
					currentDataStructure,
					{
						transformers: params.structureTransformers,
						transformerParams: structureTransformerParams,
					},
				);
			}
		},
	);

	if (DEither.isLeft(result)) {
		return result;
	}

	if (currentIdentifier) {
		const { schema, isOptional } = DEither.unwrapRight(result);

		params.context.delete(currentDataStructure);

		params.context.set(
			currentDataStructure,
			{
				name: currentIdentifier,
				schema,
				isOptional,
			},
		);

		return structureTransformerParams.success(
			{ $ref: buildRef(currentIdentifier, params.version) },
		);
	}

	return result;
}

export function buildRef(
	name: string,
	version: SupportedVersions,
) {
	if (
		version === "openApi3"
		|| version === "openApi31"
	) {
		return `#/components/schemas/${name}`;
	}

	if (version === "jsonSchema202012") {
		return `#/$defs/${name}`;
	}

	return `#/definitions/${name}`;
}
