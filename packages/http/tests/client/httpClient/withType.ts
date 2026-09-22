import { createHttpClient, type RequestErrorContent, type PromiseRequest, type PromiseRequestParams, type FindServerRoute, type AddPrefixPathServerRoute, type RemovePrefixPathServerRoute, type FindServerRouteResponse, type AllClientResponse, type AllNotPredictedClientResponse, type ClientEventsResponseHandler, type ServerRouteToClientRequestParams, type CreateClientCacheKeyParams, type ClientStreamResponseHandler } from "@client";
import type * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";

type Routes = {
	readonly method: "GET";
	readonly path: "/users";
	readonly responses: {
		readonly code: "200";
		readonly information: "users.findMany";
		readonly body: (
			& readonly {
				readonly id: number;
				readonly name: string;
				readonly age: number;
			}[]
			& DArray.MinElements<2>
			& DArray.MaxElements<10>
		);
	};
} | {
	readonly method: "GET";
	readonly path: "/users/{userId}";
	readonly params: {
		readonly userId: number;
	};
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body?: undefined;
	} | {
		readonly code: "200";
		readonly information: "users.find";
		readonly body: {
			readonly id: number;
			readonly name: string;
			readonly age: number;
		};
	};
} | {
	readonly method: "POST";
	readonly path: "/users";
	readonly body: {
		readonly id: number;
		readonly name: string;
		readonly age: number;
	};
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body?: undefined;
	} | {
		readonly code: "200";
		readonly information: "users.create";
		readonly body: {
			readonly id: number;
			readonly name: string;
			readonly age: number;
		};
	};
} | {
	readonly method: "POST";
	readonly path: "/documents";
	readonly body: DCommon.TheFormData<{
		readonly bool: boolean;
		readonly myFile: File;
		readonly name: string & DString.Trimmed;
	}>;
	readonly responses: {
		readonly code: "422";
		readonly information: "extract-error";
		readonly body?: undefined;
	} | {
		readonly code: "204";
		readonly information: "file.receive";
		readonly body?: undefined;
	};
} | {
	readonly method: "GET";
	readonly path: `/documents/${string}`;
	readonly responses: {
		readonly code: "200";
		readonly information: "file.send";
		readonly body: File;
	};
} | {
	readonly method: "GET";
	readonly path: "/sse";
	readonly responses: {
		readonly code: "200";
		readonly information: "ess";
		readonly events: {
			readonly message: { readonly test: string };
			readonly ping: string;
		};
		readonly body: undefined;
	};
} | {
	readonly method: "GET";
	readonly path: "/stream";
	readonly responses: {
		readonly code: "200";
		readonly information: "monSuperStream";
		readonly body?: undefined;
		readonly flux: Uint8Array<ArrayBuffer>;
	};
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type HooksParams = { params1: string };

const httpClient = createHttpClient<Routes, HooksParams>({
	baseUrl: "http://test.com",
});

const promiseRequest = httpClient
	.request({
		method: "GET",
		path: "/users/{userId}",
		params: {
			userId: DString.to(1),
		},
		clientCache: (params) => {
			type Check = DCommon.ExpectType<
				typeof params,
				CreateClientCacheKeyParams<HooksParams>,
				"strict"
			>;

			return null;
		},
	});

type RequestParams = DCommon.SimplifyTopLevel<
	& ServerRouteToClientRequestParams<
		FindServerRoute<
			Routes,
			"GET",
			"/users/{userId}"
		>,
		HooksParams
	>
	& PromiseRequestParams<HooksParams>
>;

type Check = DCommon.ExpectType<
	typeof promiseRequest,
	PromiseRequest<
		{
			params1: string;
		},
		| {
			code: "422";
			information: "extract-error";
			body: undefined;
			ok: boolean | null;
			headers: Headers;
			type: ResponseType;
			url: string;
			redirected: boolean;
			raw: globalThis.Response;
			requestParams: RequestParams;
			predicted: boolean;
			fromCache?: boolean;
		}
		| {
			code: "200";
			information: "users.find";
			body: {
				readonly id: number;
				readonly name: string;
				readonly age: number;
			};
			ok: boolean | null;
			headers: Headers;
			type: ResponseType;
			url: string;
			redirected: boolean;
			raw: globalThis.Response;
			requestParams: RequestParams;
			predicted: boolean;
			fromCache?: boolean;
		}
	>,
	"strict"
>;

void promiseRequest
	.whenInformation("users.find", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.whenCode("200", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.whenInformationalResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenSuccessfulResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.whenRedirectionResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenClientErrorResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.whenServerErrorResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenExpectedResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			} | {
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.whenNotPredictedResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllNotPredictedClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenError((value, requestParams) => {
		type Check = DCommon.ExpectType<
			typeof value,
			unknown,
			"strict"
		>;

		type Check1 = DCommon.ExpectType<
			typeof requestParams,
			PromiseRequestParams<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantInformation("extract-error")
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", {
					code: "200";
					information: "users.find";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantCode("422")
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", {
					code: "200";
					information: "users.find";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantInformationalResponse()
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", AllClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantSuccessfulResponse()
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", {
					code: "200";
					information: "users.find";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantRedirectionResponse()
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", AllClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantClientErrorResponse()
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", {
					code: "200";
					information: "users.find";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantServerErrorResponse()
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", AllClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantExpectedResponse()
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				} | {
					code: "200";
					information: "users.find";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iSelectExpectedResponseByInformation({
		"extract-error": false,
		"users.find": true,
	})
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<"response", {
					code: "200";
					information: "users.find";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent> | DEither.Left<"unexpect-response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams;
					predicted: boolean;
					fromCache?: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantInformationOrThrow("users.find")
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantCodeOrThrow("200")
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantInformationalResponseOrThrow()
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantSuccessfulResponseOrThrow()
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantRedirectionResponseOrThrow()
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantClientErrorResponseOrThrow()
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantServerErrorResponseOrThrow()
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantExpectedResponseOrThrow()
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			} | {
				code: "200";
				information: "users.find";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iSelectExpectedResponseByInformationOrThrow({
		"extract-error": true,
		"users.find": false,
	})
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<
					"response",
					| {
						code: "422";
						information: "extract-error";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean;
					}
					| {
						code: "200";
						information: "users.find";
						body: {
							readonly id: number;
							readonly name: string;
							readonly age: number;
						};
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean;
					}
					| AllNotPredictedClientResponse<{ params1: string }>
				>,
				"strict"
			>;
		} else {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Left<"request-error", RequestErrorContent>,
				"strict"
			>;
		}
	});

type RequestParams1 = DCommon.SimplifyTopLevel<
	& ServerRouteToClientRequestParams<
		FindServerRoute<
			Routes,
			"GET",
			"/users"
		>,
		HooksParams
	>
	& PromiseRequestParams<HooksParams>
>;

void httpClient.get("/users")
	.whenInformation("users.findMany", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.findMany";
				body: (
					& readonly {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					}[]
					& DArray.MinElements<2>
					& DArray.MaxElements<10>
				);
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: RequestParams1;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| AllNotPredictedClientResponse<{ params1: string }>
				| {
					code: "200";
					information: "users.findMany";
					body: (
						& readonly {
							readonly id: number;
							readonly name: string;
							readonly age: number;
						}[]
						& DArray.MinElements<2>
						& DArray.MaxElements<10>
					);
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams1;
					predicted: boolean;
					fromCache?: boolean;
				}
			>,
			"strict"
		>;
	});

type RequestParams2 = DCommon.SimplifyTopLevel<
	& ServerRouteToClientRequestParams<
		FindServerRoute<
			Routes,
			"POST",
			"/users"
		>,
		HooksParams
	>
	& PromiseRequestParams<HooksParams>
>;

void httpClient.post("/users", {
	body: {
		id: 1,
		name: "",
		age: 2,
	},
})
	.whenInformation("users.create", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.create";
				body: {
					readonly id: number;
					readonly name: string;
					readonly age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: Response;
				requestParams: RequestParams2;
				predicted: boolean;
				fromCache?: boolean;
			},
			"strict"
		>;
	})
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| AllNotPredictedClientResponse<{ params1: string }>
				| {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams2;
					predicted: boolean;
					fromCache?: boolean;
				}
				| {
					code: "200";
					information: "users.create";
					body: {
						readonly id: number;
						readonly name: string;
						readonly age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: RequestParams2;
					predicted: boolean;
					fromCache?: boolean;
				}
			>,
			"strict"
		>;
	});

void httpClient.post(
	"/documents",
	{
		body: DCommon.createFormData({
			bool: true,
			myFile: new File([], "test"),
			name: DCommon.forwardAsserts("superValue", DString.isTrimmed),
		}),
	},
);

void httpClient
	.get(
		"/documents/test",
		{
			hookParams: { params1: "" },
		},
	)
	.whenInformation("file.send", ({ body }) => {
		type Check = DCommon.ExpectType<
			typeof body,
			undefined,
			"strict"
		>;
	});

type RequestParams3 = DCommon.SimplifyTopLevel<
	& ServerRouteToClientRequestParams<
		FindServerRoute<
			Routes,
			"GET",
			"/sse"
		>,
		HooksParams
	>
	& PromiseRequestParams<HooksParams>
>;

void httpClient.get("/sse")
	.whenReceiveServerEvent(
		"message",
		(event, response) => {
			type Check = DCommon.ExpectType<
				typeof event,
				{
					event: "message";
					data: {
						readonly test: string;
					};
					id?: string | undefined;
					retry?: number | undefined;
				},
				"strict"
			>;
			type Check1 = DCommon.ExpectType<
				typeof response,
				{
					code: "200";
					information: "ess";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams3;
					predicted: boolean;
					fromCache?: boolean;
				} & ClientEventsResponseHandler<{
					event: "message";
					data: {
						readonly test: string;
					};
					id?: string;
					retry?: number;
				} | {
					event: "ping";
					data: string;
					id?: string;
					retry?: number;
				}>,
				"strict"
			>;
		},
	)
	.whenExpectedResponse(
		(response) => {
			response.onReceiveEvent(
				"message",
				(event, response) => {
					type Check = DCommon.ExpectType<
						typeof event,
						{
							event: "message";
							data: {
								readonly test: string;
							};
							id?: string | undefined;
							retry?: number | undefined;
						},
						"strict"
					>;

					type Check1 = DCommon.ExpectType<
						typeof response,
						{
							code: "200";
							information: "ess";
							body: undefined;
							ok: boolean | null;
							headers: Headers;
							type: ResponseType;
							url: string;
							redirected: boolean;
							raw: globalThis.Response;
							requestParams: RequestParams3;
							predicted: boolean;
							fromCache?: boolean;
						} & ClientEventsResponseHandler<{
							event: "message";
							data: {
								readonly test: string;
							};
							id?: string;
							retry?: number;
						} | {
							event: "ping";
							data: string;
							id?: string;
							retry?: number;
						}>,
						"strict"
					>;
				},
			);
		},
	);

type RequestParams4 = DCommon.SimplifyTopLevel<
	& ServerRouteToClientRequestParams<
		FindServerRoute<
			Routes,
			"GET",
			"/stream"
		>,
		HooksParams
	>
	& PromiseRequestParams<HooksParams>
>;

void httpClient.get("/stream")
	.whenReceiveDataStream(
		(data, response) => {
			type Check = DCommon.ExpectType<
				typeof data,
				Uint8Array<ArrayBuffer>,
				"strict"
			>;

			type Check1 = DCommon.ExpectType<
				typeof response,
				{
					code: "200";
					information: "monSuperStream";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: RequestParams4;
					predicted: boolean;
					fromCache?: boolean | undefined;
				} & ClientStreamResponseHandler<Uint8Array<ArrayBuffer>>,
				"strict"
			>;
		},
	)
	.whenExpectedResponse(
		(response) => {
			response.onStream("start", (response) => {
				type Check = DCommon.ExpectType<
					typeof response,
					{
						code: "200";
						information: "monSuperStream";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: globalThis.Response;
						requestParams: RequestParams4;
						predicted: boolean;
						fromCache?: boolean | undefined;
					} & ClientStreamResponseHandler<Uint8Array<ArrayBuffer>>,
					"strict"
				>;
			});

			response.onStream("receiveData", (data, response) => {
				type Check = DCommon.ExpectType<
					typeof data,
					Uint8Array<ArrayBuffer>,
					"strict"
				>;

				type Check1 = DCommon.ExpectType<
					typeof response,
					{
						code: "200";
						information: "monSuperStream";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: globalThis.Response;
						requestParams: RequestParams4;
						predicted: boolean;
						fromCache?: boolean | undefined;
					} & ClientStreamResponseHandler<Uint8Array<ArrayBuffer>>,
					"strict"
				>;
			});
		},
	);

void promiseRequest.toEitherByInformation({
	"extract-error": true,
	"users.find": true,
})
	.then((result) => {
		type Check = DCommon.ExpectType<
			typeof result,
			(
				| DEither.Right<
					"extract-error",
					{
						code: "422";
						information: "extract-error";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean | undefined;
					}
				>
				| DEither.Right<
					"users.find",
					{
						code: "200";
						information: "users.find";
						body: {
							readonly id: number;
							readonly name: string;
							readonly age: number;
						};
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean | undefined;
					}
				>
				| DEither.Left<"unexpect-response", AllClientResponse<HooksParams>>
				| DEither.Left<"request-error", RequestErrorContent>
			),
			"strict"
		>;
	});

void promiseRequest.toEitherByCode({
	200: true,
	422: true,
})
	.then((result) => {
		type Check = DCommon.ExpectType<
			typeof result,
			(
				| DEither.Right<
					"response-422",
					{
						code: "422";
						information: "extract-error";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean | undefined;
					}
				>
				| DEither.Right<
					"response-200",
					{
						code: "200";
						information: "users.find";
						body: {
							readonly id: number;
							readonly name: string;
							readonly age: number;
						};
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: RequestParams;
						predicted: boolean;
						fromCache?: boolean | undefined;
					}
				>
				| DEither.Left<"unexpect-response", AllClientResponse<HooksParams>>
				| DEither.Left<"request-error", RequestErrorContent>
			),
			"strict"
		>;
	});

void promiseRequest.toEitherByInformation({
	"extract-error": false,
	"users.find": true,
})
	.then(DEither.unwrapSelectionOrThrow({
		"users.find": true,
		"unexpect-response": false,
		"request-error": false,
	}))
	.then((response) => {
		type CheckCode = DCommon.ExpectType<
			typeof response.code,
			"200",
			"strict"
		>;

		type CheckInformation = DCommon.ExpectType<
			typeof response.information,
			"users.find",
			"strict"
		>;

		type CheckBody = DCommon.ExpectType<
			typeof response.body,
			{
				readonly id: number;
				readonly name: string;
				readonly age: number;
			},
			"strict"
		>;
	});

void promiseRequest.toEitherByCode({
	200: true,
	422: false,
})
	.then(DEither.unwrapSelectionOrThrow({
		"response-200": true,
		"unexpect-response": false,
		"request-error": false,
	}))
	.then((response) => {
		type CheckCode = DCommon.ExpectType<
			typeof response.code,
			"200",
			"strict"
		>;

		type CheckInformation = DCommon.ExpectType<
			typeof response.information,
			"users.find",
			"strict"
		>;
	});

// @ts-expect-error the selector must include every declared information.
void promiseRequest.toEitherByInformation({ "users.find": true });

// @ts-expect-error the selector cannot include undeclared information.
void promiseRequest.toEitherByInformation({
	"extract-error": true,
	"users.find": true,
	other: true,
});

// @ts-expect-error the selector must include every declared response code.
void promiseRequest.toEitherByCode({ 200: true });

// @ts-expect-error the selector cannot include an undeclared numeric response code.
void promiseRequest.toEitherByCode({
	200: true,
	422: true,
	500: true,
});

type Check1 = DCommon.ExpectType<
	RemovePrefixPathServerRoute<
		AddPrefixPathServerRoute<
			FindServerRoute<Routes, "GET", "/users/{userId}">,
			"/titi/toto"
		>,
		"/titi/"
	>,
	{
		readonly method: "GET";
		readonly path: "toto/users/{userId}";
		readonly params: {
			readonly userId: number;
		};
		readonly responses: {
			readonly code: "422";
			readonly information: "extract-error";
			readonly body?: undefined;
		} | {
			readonly code: "200";
			readonly information: "users.find";
			readonly body: {
				readonly id: number;
				readonly name: string;
				readonly age: number;
			};
		};
	},
	"strict"
>;

type Check2 = DCommon.ExpectType<
	FindServerRouteResponse<
		FindServerRoute<Routes, "GET", "/users/{userId}">,
		"information",
		"users.find"
	>,
	{
		readonly code: "200";
		readonly information: "users.find";
		readonly body: {
			readonly id: number;
			readonly name: string;
			readonly age: number;
		};
	},
	"strict"
>;
