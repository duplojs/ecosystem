import type * as DString from "@duplojs/lang/string";

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
