import type * as DString from "@duplojs/lang/string";
import { createKind } from "../kind";
import * as DKind from "@duplojs/lang/kind";
import * as DObject from "@duplojs/lang/object";

export type InformationResponseCode = `1${DString.Digit}${DString.Digit}`;

export type SuccessResponseCode = `2${DString.Digit}${DString.Digit}`;

export type RedirectionResponseCode = `3${DString.Digit}${DString.Digit}`;

export type ClientErrorResponseCode = `4${DString.Digit}${DString.Digit}`;

export type ServerErrorResponseCode = `5${DString.Digit}${DString.Digit}`;

export type ResponseCode = (
	| InformationResponseCode
	| SuccessResponseCode
	| RedirectionResponseCode
	| ClientErrorResponseCode
	| ServerErrorResponseCode
);

export class Response<
	GenericCode extends ResponseCode = ResponseCode,
	GenericInformation extends string = string,
	GenericBody extends unknown = unknown,
> extends DKind.parentClass(
		createKind("response"),
	) {
	public code: GenericCode;

	public information: GenericInformation;

	public body: GenericBody;

	public headers: Record<string, string | string[]> | undefined = undefined;

	public constructor(
		code: GenericCode,
		information: GenericInformation,
		body: GenericBody,
	) {
		super(null);

		this.code = code;
		this.information = information;
		this.body = body;
	}

	public setHeaders(headers: Partial<Record<string, string | string[]>>) {
		this.headers = DObject.override(
			this.headers ?? {},
			headers,
		);

		return this;
	}

	public setHeader(key: string, header?: string | string[]) {
		if (!this.headers) {
			this.headers = {};
		}

		if (typeof header !== "undefined") {
			this.headers[key] = header;
		}

		return this;
	}

	public deleteHeader(key: string) {
		if (!this.headers) {
			return this;
		}

		const {
			[key]: deleteHeader,
			...rest
		} = this.headers;

		this.headers = rest;

		return this;
	}
}
