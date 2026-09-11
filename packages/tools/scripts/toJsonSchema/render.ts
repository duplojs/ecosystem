import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import type * as DCommon from "@duplojs/lang/common";
import * as DKind from "@duplojs/lang/kind";
import { createKind } from "./kind";
import { type DataStructureTypeErrorEither, type DataStructureTypeNotSupportedEither, supportedVersions, type DataStructureErrorEither, type DataStructureNotSupportedEither, type JsonSchema, type MapperSupportedVersions, type SupportedVersions } from "./result";
import { type MapContext } from "./context";
import { type StructureTransformer } from "./structureTransformer";
import { type TypeTransformer } from "./typeTransformer";
import type { TransformerHook } from "./hook";
import { getRecursiveDataStructure } from "@scripts/utils";
import { buildRef, transformer } from "./transformer";

export interface RenderParams<
	GenericVersion extends SupportedVersions = SupportedVersions,
> {
	readonly identifier: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly context?: MapContext;
	readonly hooks?: readonly TransformerHook[];
	readonly version: GenericVersion;
}

export class DataStructureToJsonSchemaRenderError extends DKind.parentClass(
	createKind("data-structure-to-json-schema-render-error"),
	Error,
) {
	public constructor(
		public structure: DDataStructure.Structure,
		public error:
			| DataStructureNotSupportedEither
			| DataStructureErrorEither,
	) {
		super(
			undefined,
			"Error during the render of a data structure as a JsonSchema.",
		);
	}
}

type RenderResult<
	GenericVersion extends SupportedVersions,
> = DCommon.Or<[
	DCommon.IsEqual<GenericVersion, "openApi3">,
	DCommon.IsEqual<GenericVersion, "openApi31">,
]> extends true
	? {
		$ref: `#/components/schemas/${string}`;
		openapi: MapperSupportedVersions[GenericVersion];
		components: {
			schemas: Record<string, JsonSchema>;
		};
	}
	: DCommon.Or<[
		DCommon.IsEqual<GenericVersion, "jsonSchema7">,
		DCommon.IsEqual<GenericVersion, "jsonSchema4">,
	]> extends true
		? {
			$ref: `#/$defs/${string}`;
			$schema: MapperSupportedVersions[GenericVersion];
			definitions: Record<string, JsonSchema>;
		}
		: DCommon.IsEqual<GenericVersion, "jsonSchema202012"> extends true
			? {
				$ref: `#/definitions/${string}`;
				$schema: MapperSupportedVersions[GenericVersion];
				$defs: Record<string, JsonSchema>;
			}
			: never;

export function render<
	GenericVersion extends SupportedVersions,
>(
	structure: DDataStructure.Structures,
	params: RenderParams<GenericVersion>,
): RenderResult<GenericVersion>;

export function render(
	structure: DDataStructure.Structures,
	params: RenderParams,
): any {
	const context: MapContext = new Map(params.context);

	const result = transformer(
		structure,
		{
			identifier: params.identifier,
			structureTransformers: params.structureTransformers,
			typeTransformers: params.typeTransformers,
			context,
			version: params.version,
			recursiveDataStructures: getRecursiveDataStructure(structure),
			hooks: params.hooks ?? [],
		},
	);

	if (DEither.isLeft(result)) {
		throw new DataStructureToJsonSchemaRenderError(
			structure,
			result,
		);
	}

	const jsonSchema = DEither.unwrapRight(result);

	const definitions = DGenerator.reduce(
		context.values(),
		DGenerator.reduceFrom<Record<string, JsonSchema>>({}),
		({ item, lastValue, next }) => item.schema
			? next({
				...lastValue,
				[item.name]: item.schema,
			})
			: next(lastValue),
	);

	const definitionsWithIdentifier = definitions[params.identifier]
		? definitions
		: {
			...definitions,
			[params.identifier]: jsonSchema,
		};

	if (
		params.version === "openApi3"
		|| params.version === "openApi31"
	) {
		return {
			$ref: buildRef(params.identifier, params.version),
			openapi: supportedVersions[params.version],
			components: {
				schemas: definitionsWithIdentifier,
			},
		};
	}

	if (params.version === "jsonSchema202012") {
		return {
			$ref: buildRef(params.identifier, params.version),
			$schema: params.version,
			$defs: definitionsWithIdentifier,
		};
	}

	return {
		$ref: buildRef(params.identifier, params.version),
		$schema: supportedVersions[params.version],
		definitions: definitionsWithIdentifier,
	};
}
