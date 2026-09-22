import { createHttpClient, type RequestErrorContent, type PromiseRequest, type PromiseRequestParams, type ServerRoute, type ClientEventsResponse, type AllNotPredictedClientResponse, type AllClientResponse, type ServerEvent, isClientEventsResponse, type ServerRouteResponseFlux, type ClientStreamResponse, isClientStreamResponse } from "@client";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

const httpClient = createHttpClient<ServerRoute, { params1: string }>({
	baseUrl: "http://test.com",
});

const promiseRequest = httpClient
	.request({
		method: "GET",
		path: "/test",
	});

type Check = DCommon.ExpectType<
	typeof promiseRequest,
	PromiseRequest<
		{
			params1: string;
		},
		AllClientResponse<{
			params1: string;
		}>
	>,
	"strict"
>;

void promiseRequest
	.whenInformation("test", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenCode("200", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
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
			AllClientResponse<{
				params1: string;
			}>,
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
			AllClientResponse<{
				params1: string;
			}>,
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
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenNotPredictedResponse((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			| AllNotPredictedClientResponse<{
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
	.iWantInformation("test")
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantCode("200")
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
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
				}> | AllNotPredictedClientResponse<{
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
				}> | AllNotPredictedClientResponse<{
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iSelectExpectedResponseByInformation({
		testInformation: true,
	})
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
				}> | AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantInformationOrThrow("test")
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
	.iWantCodeOrThrow("200")
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
			AllClientResponse<{
				params1: string;
			}>,
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
			AllClientResponse<{
				params1: string;
			}>,
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
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iSelectExpectedResponseByInformationOrThrow({
		testInformation: true,
	})
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
	.then((value) => {
		if (DEither.isRight(value)) {
			type Check = DCommon.ExpectType<
				typeof value,
				DEither.Right<
					"response",
					| AllClientResponse<{
						params1: string;
					}>
					| AllNotPredictedClientResponse<{
						params1: string;
					}>
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

void httpClient.get("/test")
	.whenInformation("test", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| AllClientResponse<{ params1: string }>
				| AllNotPredictedClientResponse<{ params1: string }>
			>,
			"strict"
		>;
	});

void httpClient.get("/test", { body: "" })
	.whenInformation("test", (value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.then((value) => {
		type Check = DCommon.ExpectType<
			typeof value,
			| DEither.Left<"request-error", RequestErrorContent>
			| DEither.Right<
				"response",
				| AllClientResponse<{ params1: string }>
				| AllNotPredictedClientResponse<{ params1: string }>
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
		}),
	},
);

void httpClient.post("/see")
	.whenReceiveServerEvent(
		"message",
		(event, response) => {
			type Check = DCommon.ExpectType<
				typeof event,
				ServerEvent,
				"strict"
			>;
			type Check1 = DCommon.ExpectType<
				typeof response,
				ClientEventsResponse<{
					params1: string;
				}>,
				"strict"
			>;
		},
	)
	.whenExpectedResponse(
		(response) => {
			if (isClientEventsResponse(response)) {
				response.onReceiveEvent(
					"message",
					(event, response) => {
						type Check = DCommon.ExpectType<
							typeof event,
							ServerEvent,
							"strict"
						>;

						type Check1 = DCommon.ExpectType<
							typeof response,
							ClientEventsResponse<{
								params1: string;
							}>,
							"strict"
						>;
					},
				);

				response.onStreamEvent(
					"receiveServerEvents",
					(event, response) => {
						type Check = DCommon.ExpectType<
							typeof event,
							ServerEvent,
							"strict"
						>;

						type Check1 = DCommon.ExpectType<
							typeof response,
							ClientEventsResponse<{
								params1: string;
							}>,
							"strict"
						>;
					},
				);

				response.onStreamEvent(
					"start",
					(response) => {
						type Check1 = DCommon.ExpectType<
							typeof response,
							ClientEventsResponse<{
								params1: string;
							}>,
							"strict"
						>;
					},
				);
			}
		},
	);

void httpClient.get("/stream")
	.whenReceiveDataStream(
		(data, response) => {
			type Check = DCommon.ExpectType<
				typeof data,
				ServerRouteResponseFlux,
				"strict"
			>;

			type Check1 = DCommon.ExpectType<
				typeof response,
				ClientStreamResponse<{
					params1: string;
				}>,
				"strict"
			>;
		},
	)
	.whenExpectedResponse(
		(response) => {
			if (isClientStreamResponse(response)) {
				response.onStream("start", (response) => {
					type Check = DCommon.ExpectType<
						typeof response,
						ClientStreamResponse<{
							params1: string;
						}>,
						"strict"
					>;
				});

				response.onStream("receiveData", (data, response) => {
					type Check = DCommon.ExpectType<
						typeof data,
						ServerRouteResponseFlux,
						"strict"
					>;

					type Check1 = DCommon.ExpectType<
						typeof response,
						ClientStreamResponse<{
							params1: string;
						}>,
						"strict"
					>;
				});
			}
		},
	);

void promiseRequest.toEitherByInformation({
	superInfo1: true,
	superInfo2: false,
})
	.then((result) => {
		type Check = DCommon.ExpectType<
			typeof result,
			(
				| DEither.Right<"superInfo1", AllClientResponse<{ params1: string }>>
				| DEither.Left<"request-error", RequestErrorContent>
				| DEither.Left<"unexpect-response", AllClientResponse<{ params1: string }>>
			),
			"strict"
		>;
	});

void promiseRequest.toEitherByCode({
	200: true,
})
	.then((result) => {
		type Check = DCommon.ExpectType<
			typeof result,
			(
				| DEither.Left<"request-error", RequestErrorContent>
				| DEither.Left<"unexpect-response", AllClientResponse<{ params1: string }>>
				| DEither.Right<"response-200", AllClientResponse<{ params1: string }>>
			),
			"strict"
		>;
	});

void promiseRequest.toEitherByInformation({
	superInfo1: true,
	superInfo2: false,
})
	.then(DEither.unwrapSelectionOrThrow({
		superInfo1: true,
		"unexpect-response": false,
		"request-error": false,
	}))
	.then((response) => {
		type Check = DCommon.ExpectType<
			typeof response,
			AllClientResponse<{ params1: string }>,
			"strict"
		>;
	});

void promiseRequest.toEitherByCode({
	200: true,
})
	.then(DEither.unwrapSelectionOrThrow({
		"response-200": true,
		"unexpect-response": false,
		"request-error": false,
	}))
	.then((response) => {
		type Check = DCommon.ExpectType<
			typeof response,
			AllClientResponse<{ params1: string }>,
			"strict"
		>;
	});
