import { FormDataBodyController } from "@core/request";
import { type HttpServerParams } from "@core/types";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DObject from "@duplojs/lang/object";
import { readRequestFormData } from "./readRequestFormData";
import { randomUUID } from "node:crypto";
import { WrongContentTypeError } from "@core/errors";
import { open } from "node:fs/promises";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export * from "./error";
export * from "./readRequestFormData";

export function createFormDataBodyReaderImplementation(serverParams: HttpServerParams) {
	const serverMaxBodySize = DCommon.stringToBytes(serverParams.maxBodySize);

	async function createUploadFile(extension: string, highWaterMark?: number) {
		let remainingAttempts = 5;

		do {
			try {
				const path = DPath.resolveRelative([
					serverParams.uploadFolder,
					DPath.createOrThrow(`${randomUUID()}${extension}`),
				]);

				const handle = await open(path, "wx");

				return {
					path,
					writeStream: handle.createWriteStream({
						highWaterMark,
						autoClose: true,
					}),
				};
			} catch (error) {
				if ((error as NodeJS.ErrnoException)?.code !== "EEXIST" || --remainingAttempts === 0) {
					throw error;
				}
			}
		} while (true);
	}

	function addValue(
		mapResult: Map<string, DCommon.MaybeArray<DSFile.FileInterface | string>>,
		fieldName: string,
		newValue: DSFile.FileInterface | string,
	) {
		const value = mapResult.get(fieldName);

		if (value === undefined) {
			mapResult.set(fieldName, newValue);
		} else {
			mapResult.set(
				fieldName,
				DArray.push(DArray.coalescing(value), newValue),
			);
		}
	}

	return FormDataBodyController.createReaderImplementation(
		async(request, params) => {
			if (!request.headers["content-type"]?.includes("multipart/form-data")) {
				return DEither.left(
					"reader-error",
					new WrongContentTypeError(
						"multipart/form-data",
						DString.join(DArray.coalescing(request.headers["content-type"] ?? ""), " "),
					),
				);
			}

			const filesAttache: (string & DPath.Path)[] = [];
			request.filesAttache = filesAttache;

			const result = await readRequestFormData(
				request.raw.request,
				new Map<string, DCommon.MaybeArray<DSFile.FileInterface | string>>(),
				{
					maxBodySize: params.bodyMaxSize ?? serverMaxBodySize,
					fileMaxSize: params.fileMaxSize ?? Infinity,
					textFieldMaxSize: params.textFieldMaxSize ?? Infinity,
					maxFileQuantity: params.maxFileQuantity,
					mimeType: params.mimeType,
					maxBufferSize: params.maxBufferSize,
					maxKeyLength: params.maxKeyLength,
				},
				async(header) => {
					const fieldName = header.name;
					if (header.filename) {
						const extension = DPath.getExtensionName(header.filename);
						const displayExtension = extension ? `.${extension}` : "";
						const { path, writeStream } = await createUploadFile(
							displayExtension,
							request.raw.request.readableHighWaterMark,
						);
						filesAttache.push(path);

						return {
							onReceiveChunk: (chunk) => new Promise(
								(resolve, reject) => void writeStream.write(
									chunk,
									(result) => {
										if (result instanceof Error) {
											return void reject(result);
										}

										return void resolve();
									},
								),
							),
							onEndPart: (valueAccumulator) => {
								writeStream.end();

								addValue(
									valueAccumulator,
									fieldName,
									DSFile.createFileInterface(path),
								);

								return valueAccumulator;
							},
							onError: () => void writeStream.end(),
						};
					}

					let currentValue = "";
					return {
						onReceiveChunk: (chunk) => {
							currentValue += chunk.toString("utf-8");
						},
						onEndPart: (valueAccumulator) => {
							addValue(
								valueAccumulator,
								fieldName,
								currentValue,
							);

							return valueAccumulator;
						},
						onError: null,
					};
				},
			);

			if (DEither.isLeft(result)) {
				// mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
				request.raw.response.setHeader("Connection", "close");
				if (DEither.hasInformation(result, "server-error")) {
					throw DEither.unwrapLeft(result);
				}

				return result;
			}

			if (request.headers["x-duplojs-body-options"]?.includes("advanced")) {
				return DEither.success(
					DCommon.TheFormData.fromEntries(result.entries(), params.maxIndexArray),
				);
			}

			return DEither.success(DObject.fromEntries(result.entries()));
		},
		DDataStructure.codecsString,
	);
}
