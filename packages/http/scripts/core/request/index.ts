import type * as DObject from "@duplojs/lang/object";
import { createKind } from "../kind";
import { type BodyResult, type BodyReader } from "./bodyController";
import * as DKind from "@duplojs/lang/kind";
import type * as DPath from "@duplojs/lang/path";

export * from "./bodyController";

export interface RequestMethodsWrapper {
	GET: true;
	POST: true;
	PUT: true;
	PATCH: true;
	DELETE: true;
	HEAD: true;
	OPTIONS: true;
	TRACE: true;
	CONNECT: true;
}

export type RequestMethods = DObject.GetPropsWithValue<RequestMethodsWrapper, true>;

export interface RequestInitializationData {
	readonly headers: Partial<Record<string, string | readonly string[]>>;
	readonly host: string;
	readonly matchedPath: string | null;
	readonly method: string;
	readonly origin: string;
	readonly params: Record<string, string>;
	readonly path: string;
	readonly query: Record<string, string | readonly string[]>;
	readonly url: string;
	readonly bodyReader: BodyReader;
}

export class Request extends DKind.parentClass(
	createKind("request"),
) implements RequestInitializationData {
	public method: string;

	public headers: Partial<Record<string, string | readonly string[]>>;

	public url: string;

	public host: string;

	public origin: string;

	public path: string;

	public params: Record<string, string>;

	public query: Record<string, string | readonly string[]>;

	public matchedPath: string | null;

	public bodyReader: BodyReader;

	private bodyResult?: BodyResult = undefined;

	public filesAttache: readonly (string & DPath.Path)[] | undefined = undefined;

	public constructor(
		{
			method,
			headers,
			url,
			host,
			origin,
			path,
			params,
			query,
			matchedPath,
			bodyReader,
			...rest
		}: RequestInitializationData,
	) {
		super(null);

		this.method = method;
		this.headers = headers;
		this.url = url;
		this.host = host;
		this.origin = origin;
		this.path = path;
		this.params = params;
		this.query = query;
		this.matchedPath = matchedPath;
		this.bodyReader = bodyReader;

		for (const key in rest) {
			this[key as never] = rest[key as never];
		}
	}

	public getBodyResult(): BodyResult {
		if (this.bodyResult !== undefined) {
			return this.bodyResult;
		}

		this.bodyResult = this.bodyReader.getResult(this);

		return this.bodyResult;
	}
}
