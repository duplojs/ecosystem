import { type RouteSteps, type Route, type RoutePath } from "@core/route";
import { type ServerSentEventsPredictedResponse, type Response, type StreamPredictedResponse, type StreamTextPredictedResponse, type ResponseContract } from "@core/response";
import { type PresetCheckerStep, type CheckerStep, type CutStep, type HandlerStep, type ProcessStep, type ExtractStep, type ExtractShape } from "@core/steps";
import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import { type IgnoreByCodeGeneratorMetadata } from "@plugin-codeGenerator/metadata";
import { type defaultExtractContract } from "@core/hub";

export interface OverrideDefaultExtractEndpointContract {

}

export type DefaultExtractEndpointContract = OverrideDefaultExtractEndpointContract extends infer InferredValue
	? "override" extends keyof InferredValue
		? DCommon.NeverCoalescing<
			Extract<InferredValue["override"], ResponseContract.Contract>,
			typeof defaultExtractContract
		>
		: typeof defaultExtractContract
	: never;

// Vérifiez si oui ou non la payload contient une file interface. Si oui, la parcourir pour la remplacer par l'objet file de base.
type RoutePayloadToClientPayload<
	GenericPayload extends unknown,
> = GenericPayload;

type TreatExtractShape<
	GenericShape extends ExtractShape[keyof ExtractShape],
> = GenericShape extends DDataStructure.Structure
	? RoutePayloadToClientPayload<DDataStructure.StructureValue<GenericShape>>
	: GenericShape extends Record<string, DDataStructure.Structure>
		? {
			[Prop in keyof GenericShape]: RoutePayloadToClientPayload<
				DDataStructure.StructureValue<GenericShape[Prop]>
			>
		}
		: never;

export interface RouteStepToClientValue<
	GenericRouteStep extends RouteSteps = RouteSteps,
> {
	checkerStep: GenericRouteStep extends CheckerStep
		? {
			headers: unknown;
			params: unknown;
			query: unknown;
			body: unknown;
			responses: {
				code: GenericRouteStep["definition"]["responseContract"]["code"];
				information: GenericRouteStep["definition"]["responseContract"]["information"];
				body?: undefined;
			};
		}
		: never;
	presetCheckerStep: GenericRouteStep extends PresetCheckerStep
		? {
			headers: unknown;
			params: unknown;
			query: unknown;
			body: unknown;
			responses: {
				code: GenericRouteStep["definition"]["presetChecker"]["definition"]["responseContract"]["code"];
				information: GenericRouteStep["definition"]["presetChecker"]["definition"]["responseContract"]["information"];
				body?: undefined;
			};
		}
		: never;
	cutStep: GenericRouteStep extends CutStep
		? {
			headers: unknown;
			params: unknown;
			query: unknown;
			body: unknown;
			responses: Awaited<ReturnType<GenericRouteStep["definition"]["theFunction"]>> extends infer InferredValue
				? InferredValue extends Response<infer InferredCode, infer InferredInformation, infer InferredBody>
					? {
						code: InferredCode;
						information: InferredInformation;
						body: RoutePayloadToClientPayload<InferredBody>;
					}
					: never
				: never;
		}
		: never;
	processStep: GenericRouteStep extends ProcessStep
		? DCommon.IsNever<
			Extract<
				GenericRouteStep["definition"]["process"]["definition"]["metadata"][number],
				ReturnType<typeof IgnoreByCodeGeneratorMetadata>
			>
		> extends true
			? RefineStepRouteType<GenericRouteStep["definition"]["process"]["definition"]["steps"]>
			: never
		: never;
	handlerStep: GenericRouteStep extends HandlerStep
		? {
			headers: unknown;
			params: unknown;
			query: unknown;
			body: unknown;
			responses: Awaited<ReturnType<GenericRouteStep["definition"]["theFunction"]>> extends infer InferredValue
				? InferredValue extends ServerSentEventsPredictedResponse<
					infer InferredCode,
					infer InferredInformation,
					infer InferredEvents
				>
					? {
						code: InferredCode;
						information: InferredInformation;
						events: RoutePayloadToClientPayload<InferredEvents>;
					}
					: InferredValue extends StreamPredictedResponse<
						infer InferredCode,
						infer InferredInformation
					>
						? {
							code: InferredCode;
							information: InferredInformation;
							flux: Uint8Array<ArrayBuffer>;
						}
						: InferredValue extends StreamTextPredictedResponse<
							infer InferredCode,
							infer InferredInformation
						>
							? {
								code: InferredCode;
								information: InferredInformation;
								flux: string;
							}
							: InferredValue extends Response<
								infer InferredCode,
								infer InferredInformation,
								infer InferredBody
							>
								? {
									code: InferredCode;
									information: InferredInformation;
									body: RoutePayloadToClientPayload<InferredBody>;
								}
								: never
				: never;
		}
		: never;
	extractStep: GenericRouteStep extends ExtractStep
		? {
			headers: DCommon.NeverCoalescing<
				TreatExtractShape<GenericRouteStep["definition"]["shape"]["headers"]>,
				unknown
			>;
			params: DCommon.NeverCoalescing<
				TreatExtractShape<GenericRouteStep["definition"]["shape"]["params"]>,
				unknown
			>;
			query: DCommon.NeverCoalescing<
				TreatExtractShape<GenericRouteStep["definition"]["shape"]["query"]>,
				unknown
			>;
			body: DCommon.NeverCoalescing<
				TreatExtractShape<GenericRouteStep["definition"]["shape"]["body"]>,
				unknown
			>;
			responses: GenericRouteStep["definition"]["responseContract"] extends ResponseContract.Contract
				? {
					code: GenericRouteStep["definition"]["responseContract"]["code"];
					information: GenericRouteStep["definition"]["responseContract"]["information"];
					body?: undefined;
				}
				: {
					code: DefaultExtractEndpointContract["code"];
					information: DefaultExtractEndpointContract["information"];
					body?: undefined;
				};
		}
		: never;
}

type RefineStepRouteType<
	GenericRouteSteps extends readonly RouteSteps[],
> = Exclude<keyof GenericRouteSteps, keyof any[]> extends infer InferredKeys extends keyof GenericRouteSteps
	? {
		[Prop in InferredKeys]: GenericRouteSteps[Prop] extends RouteSteps
			? DCommon.IsNever<
				Extract<
					GenericRouteSteps[Prop]["definition"]["metadata"][number],
					ReturnType<typeof IgnoreByCodeGeneratorMetadata>
				>
			> extends true
				? RouteStepToClientValue<GenericRouteSteps[Prop]> extends infer InferredResult extends object
					? InferredResult[keyof InferredResult]
					: never
				: never
			: never
	}[InferredKeys]
	: never;

type ExpectShape = Record<"headers" | "params" | "query" | "body" | "responses", unknown>;

export type RefineRouteTypeDeclaration<
	GenericRoute extends Route,
> = GenericRoute extends any
	? RefineStepRouteType<GenericRoute["definition"]["steps"]> extends infer InferredValues extends ExpectShape
		? DCommon.UnionToIntersection<InferredValues> extends infer InferredIntersectionValues extends ExpectShape
			? GenericRoute["definition"]["paths"][number] extends infer InferredPath
				? InferredPath extends RoutePath
					? DCommon.SimplifyTopLevel<
						& {
							path: InferredPath;
							method: GenericRoute["definition"]["method"];
							responses: InferredValues["responses"];
						}
						& (
							unknown extends InferredIntersectionValues["headers"]
								? {}
								: { headers: InferredIntersectionValues["headers"] }
						)
						& (
							unknown extends InferredIntersectionValues["params"]
								? {}
								: { params: InferredIntersectionValues["params"] }
						)
						& (
							unknown extends InferredIntersectionValues["query"]
								? {}
								: { query: InferredIntersectionValues["query"] }
						)
						& (
							unknown extends InferredIntersectionValues["body"]
								? {}
								: { body: InferredIntersectionValues["body"] }
						)
					>
					: never
				: never
			: never
		: never
	: never;
