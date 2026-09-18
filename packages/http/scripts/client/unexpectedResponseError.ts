import { createKind } from "./kind";
import { type PromiseRequestParams, type ClientResponse } from "./types";
import * as DKind from "@duplojs/lang/kind";

export interface RequestErrorContent {
	error: unknown;
	requestParams: PromiseRequestParams;
}

export class UnexpectedInformationResponseError extends DKind.parentClass(
	createKind("unexpected-information-response-error"),
	Error,
) {
	public constructor(
		public information: string | string[],
		public response: RequestErrorContent | ClientResponse,
	) {
		super(null, "Unexpected information response.");
	}
}

export class UnexpectedCodeResponseError extends DKind.parentClass(
	createKind("unexpected-code-response-error"),
	Error,
) {
	public constructor(
		public code: string | string[],
		public response: RequestErrorContent | ClientResponse,
	) {
		super({}, "Unexpected code response.");
	}
}

export class UnexpectedResponseTypeError extends DKind.parentClass(
	createKind("unexpected-response-type-error"),
	Error,
) {
	public constructor(
		public expectType: "informational" | "successful" | "redirection" | "clientError" | "serverError",
		public response: RequestErrorContent | ClientResponse,
	) {
		super({}, "Unexpected response type.");
	}
}

export class UnexpectedResponseError extends DKind.parentClass(
	createKind("unexpected-response-error"),
	Error,
) {
	public constructor(
		public response: RequestErrorContent | ClientResponse,
	) {
		super({}, "Unexpected response.");
	}
}
