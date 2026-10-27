import { PredictedResponse } from './predicted';
import { ServerSentEventsPredictedResponse } from './serverSentEventsPredicted';
import { StreamPredictedResponse } from './streamPredicted';
import { StreamTextPredictedResponse } from './streamTextPredicted';
import { ServerSentEvents } from '../serverSentEvents';
import { Stream } from '../stream';
import type * as DCommon from "@duplojs/lang/common";
export declare namespace ResponseHelper {
    const http100Continue: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"100", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"100", GenericInformation, GenericBody>;
    };
    const switchingProtocols: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"101", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"101", GenericInformation, GenericBody>;
    };
    const processing: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"102", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"102", GenericInformation, GenericBody>;
    };
    const earlyHints: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"103", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"103", GenericInformation, GenericBody>;
    };
    const ok: <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody) => PredictedResponse<"200", GenericInformation, GenericBody>;
    const created: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"201", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"201", GenericInformation, GenericBody>;
    };
    const accepted: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"202", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"202", GenericInformation, GenericBody>;
    };
    const nonAuthoritativeInformation: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"203", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"203", GenericInformation, GenericBody>;
    };
    const noContent: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"204", GenericInformation, undefined>;
    const resetContent: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"205", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"205", GenericInformation, GenericBody>;
    };
    const partialContent: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"206", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"206", GenericInformation, GenericBody>;
    };
    const multiStatus: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"207", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"207", GenericInformation, GenericBody>;
    };
    const alreadyReported: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"208", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"208", GenericInformation, GenericBody>;
    };
    const imUsed: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"226", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"226", GenericInformation, GenericBody>;
    };
    const multipleChoices: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"300", GenericInformation, undefined>;
    const movedPermanently: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"301", GenericInformation, undefined>;
    const found: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"302", GenericInformation, undefined>;
    const seeOther: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"303", GenericInformation, undefined>;
    const notModified: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"304", GenericInformation, undefined>;
    const useProxy: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"305", GenericInformation, undefined>;
    const switchProxy: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"306", GenericInformation, undefined>;
    const temporaryRedirect: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"307", GenericInformation, undefined>;
    const permanentRedirect: <GenericInformation extends string>(information: GenericInformation) => PredictedResponse<"308", GenericInformation, undefined>;
    const badRequest: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"400", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"400", GenericInformation, GenericBody>;
    };
    const unauthorized: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"401", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"401", GenericInformation, GenericBody>;
    };
    const paymentRequired: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"402", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"402", GenericInformation, GenericBody>;
    };
    const forbidden: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"403", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"403", GenericInformation, GenericBody>;
    };
    const notFound: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"404", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"404", GenericInformation, GenericBody>;
    };
    const methodNotAllowed: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"405", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"405", GenericInformation, GenericBody>;
    };
    const notAcceptable: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"406", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"406", GenericInformation, GenericBody>;
    };
    const proxyAuthenticationRequired: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"407", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"407", GenericInformation, GenericBody>;
    };
    const requestTimeout: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"408", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"408", GenericInformation, GenericBody>;
    };
    const conflict: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"409", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"409", GenericInformation, GenericBody>;
    };
    const gone: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"410", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"410", GenericInformation, GenericBody>;
    };
    const lengthRequired: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"411", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"411", GenericInformation, GenericBody>;
    };
    const preconditionFailed: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"412", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"412", GenericInformation, GenericBody>;
    };
    const contentTooLarge: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"413", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"413", GenericInformation, GenericBody>;
    };
    const uriTooLong: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"414", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"414", GenericInformation, GenericBody>;
    };
    const unsupportedMediaType: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"415", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"415", GenericInformation, GenericBody>;
    };
    const rangeNotSatisfiable: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"416", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"416", GenericInformation, GenericBody>;
    };
    const expectationFailed: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"417", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"417", GenericInformation, GenericBody>;
    };
    const imATeapot: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"418", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"418", GenericInformation, GenericBody>;
    };
    const misdirectedRequest: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"421", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"421", GenericInformation, GenericBody>;
    };
    const unprocessableContent: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"422", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"422", GenericInformation, GenericBody>;
    };
    const locked: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"423", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"423", GenericInformation, GenericBody>;
    };
    const failedDependency: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"424", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"424", GenericInformation, GenericBody>;
    };
    const tooEarly: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"425", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"425", GenericInformation, GenericBody>;
    };
    const upgradeRequired: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"426", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"426", GenericInformation, GenericBody>;
    };
    const preconditionRequired: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"428", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"428", GenericInformation, GenericBody>;
    };
    const tooManyRequests: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"429", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"429", GenericInformation, GenericBody>;
    };
    const requestHeaderFieldsTooLarge: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"431", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"431", GenericInformation, GenericBody>;
    };
    const unavailableForLegalReasons: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"451", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"451", GenericInformation, GenericBody>;
    };
    const internalServerError: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"500", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"500", GenericInformation, GenericBody>;
    };
    const notImplemented: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"501", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"501", GenericInformation, GenericBody>;
    };
    const badGateway: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"502", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"502", GenericInformation, GenericBody>;
    };
    const serviceUnavailable: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"503", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"503", GenericInformation, GenericBody>;
    };
    const gatewayTimeout: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"504", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"504", GenericInformation, GenericBody>;
    };
    const httpVersionNotSupported: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"505", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"505", GenericInformation, GenericBody>;
    };
    const variantAlsoNegotiates: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"506", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"506", GenericInformation, GenericBody>;
    };
    const insufficientStorage: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"507", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"507", GenericInformation, GenericBody>;
    };
    const loopDetected: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"508", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"508", GenericInformation, GenericBody>;
    };
    const notExtended: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"510", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"510", GenericInformation, GenericBody>;
    };
    const networkAuthenticationRequired: {
        <GenericInformation extends string>(information: GenericInformation): PredictedResponse<"511", GenericInformation, undefined>;
        <GenericInformation extends string, const GenericBody extends unknown>(information: GenericInformation, body: GenericBody): PredictedResponse<"511", GenericInformation, GenericBody>;
    };
    interface ServerSentEventsBuilder<GenericInformation extends string = string> {
        onStart<GenericMessageValue extends unknown = never, GenericEvents extends ServerSentEvents.DefinitionShape = {}>(startStream: (params: ServerSentEvents.StartSendingParams<{
            message: GenericMessageValue;
        } & GenericEvents>) => DCommon.MaybePromise<void>): ServerSentEventsPredictedResponse<"200", GenericInformation, {
            message: GenericMessageValue;
        } & GenericEvents>;
    }
    function serverSentEvents<GenericInformation extends string>(information: GenericInformation): ServerSentEventsBuilder<GenericInformation>;
    interface StreamBuilder<GenericInformation extends string = string> {
        onStart<GenericFlux extends unknown = never>(startStream: (params: Stream.StartSendingParams<GenericFlux>) => DCommon.MaybePromise<void>): StreamPredictedResponse<"200", GenericInformation, GenericFlux>;
    }
    function stream<GenericInformation extends string>(information: GenericInformation): StreamBuilder<GenericInformation>;
    interface StreamTextBuilder<GenericInformation extends string = string> {
        onStart(startStream: (params: Stream.StartSendingParams<string>) => DCommon.MaybePromise<void>): StreamTextPredictedResponse<"200", GenericInformation>;
    }
    function streamText<GenericInformation extends string>(information: GenericInformation): StreamTextBuilder<GenericInformation>;
    type Methods400 = DCommon.SimplifyTopLevel<Pick<typeof ResponseHelper, "badRequest" | "unauthorized" | "paymentRequired" | "forbidden" | "notFound" | "methodNotAllowed" | "notAcceptable" | "proxyAuthenticationRequired" | "requestTimeout" | "conflict" | "gone" | "lengthRequired" | "preconditionFailed" | "contentTooLarge" | "uriTooLong" | "unsupportedMediaType" | "rangeNotSatisfiable" | "expectationFailed" | "imATeapot" | "misdirectedRequest" | "unprocessableContent" | "locked" | "failedDependency" | "tooEarly" | "upgradeRequired" | "preconditionRequired" | "tooManyRequests" | "requestHeaderFieldsTooLarge" | "unavailableForLegalReasons" | "internalServerError">>;
}
