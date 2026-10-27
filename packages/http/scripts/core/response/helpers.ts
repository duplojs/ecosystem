import { type ResponseCode } from "./base";
import { PredictedResponse } from "./predicted";
import { ServerSentEventsPredictedResponse } from "./serverSentEventsPredicted";
import { StreamPredictedResponse } from "./streamPredicted";
import { StreamTextPredictedResponse } from "./streamTextPredicted";
import { type ServerSentEvents } from "../serverSentEvents";
import { type Stream } from "../stream";
import type * as DCommon from "@duplojs/lang/common";

export namespace ResponseHelper {
	function createResponseHelper<
		GenericCode extends ResponseCode,
	>(code: GenericCode) {
		return <
			GenericInformation extends string,
			const GenericBody extends unknown,
		>(
			information: GenericInformation,
			body: GenericBody,
		) => new PredictedResponse(code, information, body);
	}

	function createOptionalBodyResponseHelper<
		GenericCode extends ResponseCode,
	>(code: GenericCode) {
		function helper<GenericInformation extends string>(
			information: GenericInformation,
		): PredictedResponse<GenericCode, GenericInformation, undefined>;
		function helper<
			GenericInformation extends string,
			const GenericBody extends unknown,
		>(
			information: GenericInformation,
			body: GenericBody,
		): PredictedResponse<GenericCode, GenericInformation, GenericBody>;
		function helper(information: string, body?: unknown) {
			return new PredictedResponse(code, information, body);
		}

		return helper;
	}

	function createBodyLessResponseHelper<
		GenericCode extends ResponseCode,
	>(code: GenericCode) {
		return <GenericInformation extends string>(
			information: GenericInformation,
		) => new PredictedResponse(code, information, undefined);
	}

	export const http100Continue = createOptionalBodyResponseHelper("100");
	export const switchingProtocols = createOptionalBodyResponseHelper("101");
	export const processing = createOptionalBodyResponseHelper("102");
	export const earlyHints = createOptionalBodyResponseHelper("103");

	export const ok = createResponseHelper("200");
	export const created = createOptionalBodyResponseHelper("201");
	export const accepted = createOptionalBodyResponseHelper("202");
	export const nonAuthoritativeInformation = createOptionalBodyResponseHelper("203");
	export const noContent = createBodyLessResponseHelper("204");
	export const resetContent = createOptionalBodyResponseHelper("205");
	export const partialContent = createOptionalBodyResponseHelper("206");
	export const multiStatus = createOptionalBodyResponseHelper("207");
	export const alreadyReported = createOptionalBodyResponseHelper("208");
	export const imUsed = createOptionalBodyResponseHelper("226");

	export const multipleChoices = createBodyLessResponseHelper("300");
	export const movedPermanently = createBodyLessResponseHelper("301");
	export const found = createBodyLessResponseHelper("302");
	export const seeOther = createBodyLessResponseHelper("303");
	export const notModified = createBodyLessResponseHelper("304");
	export const useProxy = createBodyLessResponseHelper("305");
	export const switchProxy = createBodyLessResponseHelper("306");
	export const temporaryRedirect = createBodyLessResponseHelper("307");
	export const permanentRedirect = createBodyLessResponseHelper("308");

	export const badRequest = createOptionalBodyResponseHelper("400");
	export const unauthorized = createOptionalBodyResponseHelper("401");
	export const paymentRequired = createOptionalBodyResponseHelper("402");
	export const forbidden = createOptionalBodyResponseHelper("403");
	export const notFound = createOptionalBodyResponseHelper("404");
	export const methodNotAllowed = createOptionalBodyResponseHelper("405");
	export const notAcceptable = createOptionalBodyResponseHelper("406");
	export const proxyAuthenticationRequired = createOptionalBodyResponseHelper("407");
	export const requestTimeout = createOptionalBodyResponseHelper("408");
	export const conflict = createOptionalBodyResponseHelper("409");
	export const gone = createOptionalBodyResponseHelper("410");
	export const lengthRequired = createOptionalBodyResponseHelper("411");
	export const preconditionFailed = createOptionalBodyResponseHelper("412");
	export const contentTooLarge = createOptionalBodyResponseHelper("413");
	export const uriTooLong = createOptionalBodyResponseHelper("414");
	export const unsupportedMediaType = createOptionalBodyResponseHelper("415");
	export const rangeNotSatisfiable = createOptionalBodyResponseHelper("416");
	export const expectationFailed = createOptionalBodyResponseHelper("417");
	export const imATeapot = createOptionalBodyResponseHelper("418");
	export const misdirectedRequest = createOptionalBodyResponseHelper("421");
	export const unprocessableContent = createOptionalBodyResponseHelper("422");
	export const locked = createOptionalBodyResponseHelper("423");
	export const failedDependency = createOptionalBodyResponseHelper("424");
	export const tooEarly = createOptionalBodyResponseHelper("425");
	export const upgradeRequired = createOptionalBodyResponseHelper("426");
	export const preconditionRequired = createOptionalBodyResponseHelper("428");
	export const tooManyRequests = createOptionalBodyResponseHelper("429");
	export const requestHeaderFieldsTooLarge = createOptionalBodyResponseHelper("431");
	export const unavailableForLegalReasons = createOptionalBodyResponseHelper("451");

	export const internalServerError = createOptionalBodyResponseHelper("500");
	export const notImplemented = createOptionalBodyResponseHelper("501");
	export const badGateway = createOptionalBodyResponseHelper("502");
	export const serviceUnavailable = createOptionalBodyResponseHelper("503");
	export const gatewayTimeout = createOptionalBodyResponseHelper("504");
	export const httpVersionNotSupported = createOptionalBodyResponseHelper("505");
	export const variantAlsoNegotiates = createOptionalBodyResponseHelper("506");
	export const insufficientStorage = createOptionalBodyResponseHelper("507");
	export const loopDetected = createOptionalBodyResponseHelper("508");
	export const notExtended = createOptionalBodyResponseHelper("510");
	export const networkAuthenticationRequired = createOptionalBodyResponseHelper("511");

	export interface ServerSentEventsBuilder<
		GenericInformation extends string = string,
	> {
		onStart<
			GenericMessageValue extends unknown,
			GenericEvents extends ServerSentEvents.DefinitionShape = {},
		>(
			startStream: (
				params: ServerSentEvents.StartSendingParams<
					& { message: GenericMessageValue }
					& GenericEvents
				>,
			) => DCommon.MaybePromise<void>,
		): ServerSentEventsPredictedResponse<
			"200",
			GenericInformation,
			& { message: GenericMessageValue }
			& GenericEvents
		>;
	}

	export function serverSentEvents<
		GenericInformation extends string,
	>(
		information: GenericInformation,
	): ServerSentEventsBuilder<GenericInformation> {
		return {
			onStart: (startSendingEvents) => new ServerSentEventsPredictedResponse(
				"200",
				information,
				startSendingEvents,
			),
		};
	}

	export interface StreamBuilder<
		GenericInformation extends string = string,
	> {
		onStart<
			GenericFlux extends unknown,
		>(
			startStream: (
				params: Stream.StartSendingParams<GenericFlux>,
			) => DCommon.MaybePromise<void>,
		): StreamPredictedResponse<
			"200",
			GenericInformation,
			GenericFlux
		>;
	}

	export function stream<
		GenericInformation extends string,
	>(
		information: GenericInformation,
	): StreamBuilder<GenericInformation> {
		return {
			onStart: (startParams) => new StreamPredictedResponse(
				"200",
				information,
				startParams,
			),
		};
	}

	export interface StreamTextBuilder<
		GenericInformation extends string = string,
	> {
		onStart(
			startStream: (
				params: Stream.StartSendingParams<string>,
			) => DCommon.MaybePromise<void>,
		): StreamTextPredictedResponse<
			"200",
			GenericInformation
		>;
	}

	export function streamText<
		GenericInformation extends string,
	>(
		information: GenericInformation,
	): StreamTextBuilder<GenericInformation> {
		return {
			onStart: (startStream) => new StreamTextPredictedResponse(
				"200",
				information,
				startStream,
			),
		};
	}

	export type Methods400 = DCommon.SimplifyTopLevel<
		Pick<
			typeof ResponseHelper,
			| "badRequest"
			| "unauthorized"
			| "paymentRequired"
			| "forbidden"
			| "notFound"
			| "methodNotAllowed"
			| "notAcceptable"
			| "proxyAuthenticationRequired"
			| "requestTimeout"
			| "conflict"
			| "gone"
			| "lengthRequired"
			| "preconditionFailed"
			| "contentTooLarge"
			| "uriTooLong"
			| "unsupportedMediaType"
			| "rangeNotSatisfiable"
			| "expectationFailed"
			| "imATeapot"
			| "misdirectedRequest"
			| "unprocessableContent"
			| "locked"
			| "failedDependency"
			| "tooEarly"
			| "upgradeRequired"
			| "preconditionRequired"
			| "tooManyRequests"
			| "requestHeaderFieldsTooLarge"
			| "unavailableForLegalReasons"
			| "internalServerError"
		>
	>;
}
