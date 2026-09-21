import { type Route } from "@core/route";
import { aggregateStepContract } from "./aggregateStepContract";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DObject from "@duplojs/lang/object";
import * as DString from "@duplojs/lang/string";
import { type ResponseContract } from "@core/response";
import { IgnoreByCodeGeneratorMetadata } from "./metadata";
import { FormDataBodyController } from "@core/request";
import { type DataStructureToTypescript, Typescript } from "@duplojs/tools";

export interface RouteToStructureParams {
	readonly defaultExtractContract: ResponseContract.Contract;
}

export const bodyAsFormData: DataStructureToTypescript.StructureTransformer = (
	structure,
	{ transformer, success, addImport },
) => {
	const result = transformer(structure);

	if (DEither.isLeft(result)) {
		return result;
	}

	addImport("@duplojs/lang/common", "DCommon", "namespace");

	return success(
		Typescript.factory.createTypeReferenceNode(
			Typescript.factory.createQualifiedName(
				Typescript.factory.createIdentifier("DCommon"),
				Typescript.factory.createIdentifier("TheFormData"),
			),
			[DEither.unwrapRight(result)],
		),
	);
};

export function convertRoutePath(path: string) {
	if (DString.includes(path, "*")) {
		const splittedPath = DString.split(path, "*");
		const head = Typescript.factory.createTemplateHead(DArray.first(splittedPath));
		const tails = DCommon.pipe(
			splittedPath,
			DArray.shift,
			DArray.map(
				(element, { index, self }) => Typescript.factory.createTemplateLiteralTypeSpan(
					Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
					DArray.isLastIndex(self, index)
						? Typescript.factory.createTemplateTail(element)
						: Typescript.factory.createTemplateMiddle(element),
				),
			),
		);

		const templateLiteralType = Typescript.factory.createTemplateLiteralType(
			head,
			tails,
		);

		return DDataStructure
			.string()
			.addOverrideTypescriptTransformer(templateLiteralType);
	}

	return DDataStructure.literal(path);
}

export function routeToStructure(
	route: Route,
	params: RouteToStructureParams,
): readonly DDataStructure.Structure[] {
	const isIgnore = DArray.find(
		route.definition.metadata,
		IgnoreByCodeGeneratorMetadata.is,
	);

	if (isIgnore) {
		return [];
	}

	return DCommon.pipe(
		[
			...route.definition.preflightSteps,
			...route.definition.steps,
		],
		(steps) => aggregateStepContract(steps, {
			defaultExtractContract: params.defaultExtractContract,
		}),
		DObject.transformProperty(
			"entrypointContract",
			DCommon.innerPipe(
				DObject.entries,
				DArray.select(
					({ element: [key, value], select, skip }) => {
						if (DDataStructure.structureKind.has(value)) {
							return select(DObject.entry(key, value));
						}

						if (DObject.countKeys(value) > 0) {
							return select(
								DObject.entry(key, DDataStructure.object(value)),
							);
						}

						return skip();
					},
				),
				DObject.fromEntries,
			),
		),
		({ endpointContract, entrypointContract }) => DArray.map(
			route.definition.paths,
			(path) => DDataStructure.object({
				method: DDataStructure.literal(route.definition.method),
				path: convertRoutePath(path),
				...entrypointContract,
				...(
					entrypointContract.body && FormDataBodyController.is(route.definition.bodyController)
						? {
							body: entrypointContract
								.body
								.addOverrideTypescriptTransformer(bodyAsFormData),
						}
						: {}
				),
				responses: DDataStructure.union(endpointContract as never),
			}),
		),
	);
}
