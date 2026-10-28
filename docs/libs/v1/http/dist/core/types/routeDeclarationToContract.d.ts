import { RouteSteps, RoutePreFlightSteps, Route, RoutePath } from '../route';
import { ServerSentEventsPredictedResponse, Response, StreamPredictedResponse, StreamTextPredictedResponse } from '../response';
import { PresetCheckerStep, CheckerStep, CutStep, HandlerStep, ProcessStep, ExtractStep, ExtractShape } from '../steps';
import { FormDataBodyController } from '../request';
import { DefaultOtherwiseExtractResponse } from './defaultOtherwiseExtractResponse';
import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DSFile from "@duplojs/server/file";
import type * as DString from "@duplojs/lang/string";
type TreatResponse<GenericResponse extends unknown> = GenericResponse extends Response<infer InferredCode, infer InferredInformation, infer InferredBody> ? {
    readonly code: InferredCode;
    readonly information: InferredInformation;
    readonly body: DCommon.Replace<InferredBody extends DSFile.FileInterface ? File : InferredBody, [
        Error,
        string
    ], "extends">;
} : never;
type TreatExtractShape<GenericShape extends ExtractShape[keyof ExtractShape]> = GenericShape extends DDataStructure.Structure ? DDataStructure.StructureValue<GenericShape> : GenericShape extends Record<string, DDataStructure.Structure> ? {
    readonly [Prop in keyof GenericShape]: DDataStructure.StructureValue<GenericShape[Prop]>;
} : never;
export interface RouteStepDeclarationToContract<GenericRouteStep extends RouteSteps | RoutePreFlightSteps = RouteSteps> {
    checkerStep: GenericRouteStep extends CheckerStep ? {
        readonly headers: unknown;
        readonly params: unknown;
        readonly query: unknown;
        readonly body: unknown;
        readonly responses: TreatResponse<Awaited<ReturnType<GenericRouteStep["definition"]["otherwise"]>>>;
    } : never;
    presetCheckerStep: GenericRouteStep extends PresetCheckerStep ? {
        readonly headers: unknown;
        readonly params: unknown;
        readonly query: unknown;
        readonly body: unknown;
        readonly responses: TreatResponse<Awaited<ReturnType<GenericRouteStep["definition"]["presetChecker"]["definition"]["otherwise"]>>>;
    } : never;
    cutStep: GenericRouteStep extends CutStep ? {
        readonly headers: unknown;
        readonly params: unknown;
        readonly query: unknown;
        readonly body: unknown;
        readonly responses: TreatResponse<Awaited<ReturnType<GenericRouteStep["definition"]["theFunction"]>>>;
    } : never;
    processStep: GenericRouteStep extends ProcessStep ? RefineStepRouteType<GenericRouteStep["definition"]["process"]["definition"]["steps"]> : never;
    handlerStep: GenericRouteStep extends HandlerStep ? {
        readonly headers: unknown;
        readonly params: unknown;
        readonly query: unknown;
        readonly body: unknown;
        readonly responses: Awaited<ReturnType<GenericRouteStep["definition"]["theFunction"]>> extends infer InferredValue ? InferredValue extends ServerSentEventsPredictedResponse<infer InferredCode, infer InferredInformation, infer InferredEvents> ? {
            readonly code: InferredCode;
            readonly information: InferredInformation;
            readonly events: InferredEvents;
        } : InferredValue extends StreamPredictedResponse<infer InferredCode, infer InferredInformation> ? {
            readonly code: InferredCode;
            readonly information: InferredInformation;
            readonly flux: Uint8Array<ArrayBuffer>;
        } : InferredValue extends StreamTextPredictedResponse<infer InferredCode, infer InferredInformation> ? {
            readonly code: InferredCode;
            readonly information: InferredInformation;
            readonly flux: string;
        } : TreatResponse<InferredValue> : never;
    } : never;
    extractStep: GenericRouteStep extends ExtractStep ? {
        readonly headers: DCommon.NeverCoalescing<TreatExtractShape<GenericRouteStep["definition"]["shape"]["headers"]>, unknown>;
        readonly params: DCommon.NeverCoalescing<TreatExtractShape<GenericRouteStep["definition"]["shape"]["params"]>, unknown>;
        readonly query: DCommon.NeverCoalescing<TreatExtractShape<GenericRouteStep["definition"]["shape"]["query"]>, unknown>;
        readonly body: DCommon.NeverCoalescing<TreatExtractShape<GenericRouteStep["definition"]["shape"]["body"]>, unknown>;
        readonly responses: GenericRouteStep["definition"]["otherwise"] extends DCommon.AnyFunction ? TreatResponse<Awaited<ReturnType<GenericRouteStep["definition"]["otherwise"]>>> : TreatResponse<DefaultOtherwiseExtractResponse>;
    } : never;
}
type RefineStepRouteType<GenericRouteSteps extends readonly (RouteSteps | RoutePreFlightSteps)[]> = Exclude<keyof GenericRouteSteps, keyof any[]> extends infer InferredKeys extends keyof GenericRouteSteps ? {
    [Prop in InferredKeys]: GenericRouteSteps[Prop] extends RouteSteps | RoutePreFlightSteps ? RouteStepDeclarationToContract<GenericRouteSteps[Prop]> extends infer InferredResult extends object ? InferredResult[keyof InferredResult] : never : never;
}[InferredKeys] : never;
type ExpectShape = Record<"headers" | "params" | "query" | "body" | "responses", unknown>;
type TreatRoutePath<GenericPath extends RoutePath> = DString.Split<GenericPath, "*"> extends infer InferredResult extends readonly string[] ? DString.Join<InferredResult, string> : never;
export type RouteDeclarationToContract<GenericRoute extends Route> = GenericRoute extends any ? RefineStepRouteType<readonly [
    ...GenericRoute["definition"]["preflightSteps"],
    ...GenericRoute["definition"]["steps"]
]> extends infer InferredValues extends ExpectShape ? DCommon.UnionToIntersection<InferredValues> extends infer InferredIntersectionValues extends ExpectShape ? GenericRoute["definition"]["paths"][number] extends infer InferredPath ? InferredPath extends RoutePath ? DCommon.SimplifyTopLevel<{
    readonly path: TreatRoutePath<InferredPath>;
    readonly method: GenericRoute["definition"]["method"];
    readonly responses: InferredValues["responses"];
} & (unknown extends InferredIntersectionValues["headers"] ? {} : {
    readonly headers: InferredIntersectionValues["headers"];
}) & (unknown extends InferredIntersectionValues["params"] ? {} : {
    readonly params: InferredIntersectionValues["params"];
}) & (unknown extends InferredIntersectionValues["query"] ? {} : {
    readonly query: InferredIntersectionValues["query"];
}) & (unknown extends InferredIntersectionValues["body"] ? {} : {
    readonly body: GenericRoute["definition"]["bodyController"] extends ReturnType<typeof FormDataBodyController["create"]> ? DCommon.TheFormData<Extract<DCommon.Replace<InferredIntersectionValues["body"], [DSFile.FileInterface, File], "extends">, Record<string, DCommon.EligibleFormDataValue>>> : InferredIntersectionValues["body"];
})> : never : never : never : never : never;
export {};
