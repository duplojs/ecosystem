
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import type http from "http";
import { BodyParseFormDataError } from "./error";
import { BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@core/errors";
import * as DPath from "@duplojs/lang/path";

const endHeaderPart = Buffer.from("\r\n\r\n");
const bufferStart = Buffer.from("\r\n");
const regexBoundary = /boundary=(?<boundary>[^; ]+)/i;
const regexHeaderPart = /name="(?<name>(?:\\"|[^"])+)"(?:; filename="(?<filename>(?:\\"|[^"])+)")?(?:;\s+filename\*=[^']+'[^']*'(?<encodedFilename>[^;\r\n\s]+))?/i;

function safeDecode(value: string) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

interface HeaderPartInformation {
	name: string;
	filename?: string & DPath.Segment;
}

export interface ReadRequestFormDataStreamChunkEvent<
	GenericValueAccumulator extends unknown = unknown,
> {
	onReceiveChunk(chunk: Buffer): DCommon.MaybePromise<void>;
	onEndPart(valueAccumulator: GenericValueAccumulator): DCommon.MaybePromise<GenericValueAccumulator>;
	onError: ((error: unknown, valueAccumulator: GenericValueAccumulator) => DCommon.MaybePromise<void>) | null;
}

export interface ReadRequestFormDataParams {
	maxBodySize: number;
	maxFileQuantity: number;
	maxBufferSize: number;
	maxKeyLength: number;
	fileMaxSize: number;
	textFieldMaxSize: number;
	mimeType?: RegExp;
}

export async function readRequestFormData<
	GenericValueAccumulator extends unknown,
	GenericOutputHeader extends DEither.Left = never,
>(
	request: http.IncomingMessage,
	firstValueAccumulator: GenericValueAccumulator,
	params: ReadRequestFormDataParams,
	onReceiveHeader: (header: HeaderPartInformation) => DCommon.MaybePromise<
		| ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator>
		| Error
	>,
): Promise<
	| DEither.Left<"server-error", unknown>
	| GenericOutputHeader
	| DEither.Left<"reader-error", Error>
	| GenericValueAccumulator
> {
	const boundary = DString.extract(
		request.headers["content-type"] ?? "",
		regexBoundary,
	)?.namedGroups?.boundary;

	if (!boundary) {
		return DEither.left("reader-error", new BodyParseFormDataError("Wrong boundary."));
	}

	let valueAccumulator: GenericValueAccumulator = firstValueAccumulator;

	const startPart = Buffer.from(`\r\n--${boundary}\r\n`);
	const endMultiPart = Buffer.from(`\r\n--${boundary}--\r\n`);

	let currentBuffer = bufferStart;
	let size = 0;
	const keep = endMultiPart.length;

	let currentStream = undefined as ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator> | undefined;
	let fileQuantity = 0;
	let currentFileSize = undefined as undefined | number;
	let currentTextFieldSize = undefined as undefined | number;

	const checkSize = (receivedChunk: Buffer): true | Error => {
		size += receivedChunk.length;

		return size > params.maxBodySize
			? new BodySizeExceedsLimitError(params.maxBodySize)
			: true;
	};

	const flushReceiveHeader = async(headerPart: Buffer): Promise<Error | true> => {
		valueAccumulator = await currentStream?.onEndPart(valueAccumulator) ?? valueAccumulator;

		const sizeResult = checkSize(headerPart);
		if (sizeResult !== true) {
			return sizeResult;
		}

		const extract = DString.extract(
			headerPart.toString("utf-8"),
			regexHeaderPart,
		)?.namedGroups;

		const header = DCommon.justExec(() => {
			const name = extract?.name?.trim();
			if (!name) {
				return new BodyParseFormDataError("Bad content header part.");
			}

			const filename = (
				extract?.encodedFilename !== undefined
					? safeDecode(extract.encodedFilename)
					: extract?.filename
			)?.trim();

			if (filename !== undefined) {
				if (DPath.isSegment(filename)) {
					return {
						name,
						filename,
					};
				} else {
					return new BodyParseFormDataError(`Invalid filename: "${filename}".`);
				}
			}

			return {
				name,
			};
		});

		if (header instanceof BodyParseFormDataError) {
			return header;
		}

		if (header.name.length > params.maxKeyLength) {
			return new BodyParseFormDataError("Key length exceeds limit.");
		}

		if (header.filename !== undefined) {
			currentFileSize = 0;
			currentTextFieldSize = undefined;
			fileQuantity++;
			if (fileQuantity > params.maxFileQuantity) {
				return new BodyParseFormDataError("File quantity exceeds limit.");
			} else if (
				params.mimeType !== undefined
				&& !params.mimeType.test(DPath.getExtensionName(header.filename) ?? "")
			) {
				return new BodyParseFormDataError("File have wrong mimeType.");
			}
		} else {
			currentFileSize = undefined;
			currentTextFieldSize = 0;
		}

		const newStream = await onReceiveHeader(header);

		if (newStream instanceof Error) {
			return newStream;
		}

		currentStream = newStream;

		return true;
	};

	const flushReceiveChunk = async(chunk: Buffer): Promise<Error | true> => {
		if (chunk.length === 0) {
			return true;
		}

		const sizeResult = checkSize(chunk);
		if (sizeResult !== true) {
			return sizeResult;
		}

		if (!currentStream) {
			return new BodyParseFormDataError("Receive chunk before header part.");
		}

		if (typeof currentFileSize === "number") {
			currentFileSize += chunk.length;
			if (currentFileSize > params.fileMaxSize) {
				return new BodyParseFormDataError("File size exceeds limit.");
			}
		}

		if (typeof currentTextFieldSize === "number") {
			currentTextFieldSize += chunk.length;
			if (currentTextFieldSize > params.textFieldMaxSize) {
				return new BodyParseFormDataError("Text field size exceeds limit.");
			}
		}

		await currentStream.onReceiveChunk(chunk);

		return true;
	};

	const treatError = async(error: Error): Promise<DEither.Left<"reader-error", Error>> => {
		await currentStream?.onError?.(error, valueAccumulator);
		return DEither.left("reader-error", error);
	};

	try {
		for await (const chunk of request) {
			if (!(chunk instanceof Buffer)) {
				return await treatError(new BodyParseWrongChunkReceived("Buffer.", chunk));
			}

			if (currentBuffer.length > params.maxBufferSize) {
				return await treatError(new BodyParseFormDataError("Buffer size exceeds limit."));
			}

			currentBuffer = Buffer.concat([currentBuffer, chunk]);

			while (true) {
				const startPartIndex = currentBuffer.indexOf(startPart);
				const endHeaderPartIndex = currentBuffer.indexOf(endHeaderPart);
				if (startPartIndex !== -1 && endHeaderPartIndex !== -1) {
					// check if buffer contain an entire header of part
					const resultChunk = await flushReceiveChunk(
						currentBuffer.subarray(0, startPartIndex),
					);

					if (resultChunk !== true) {
						return await treatError(resultChunk);
					}

					const endIndex = endHeaderPartIndex + endHeaderPart.length;

					const resultHeader = await flushReceiveHeader(
						currentBuffer.subarray(startPartIndex, endIndex),
					);

					if (resultHeader !== true) {
						return await treatError(resultHeader);
					}
					currentBuffer = currentBuffer.subarray(endIndex);
				} else if (startPartIndex === -1 && endHeaderPartIndex === -1) {
					// check if buffer contain only data
					if (currentBuffer.length > keep) {
						const bufferRestIndex = currentBuffer.length - keep;
						const resultChunk = await flushReceiveChunk(
							currentBuffer.subarray(0, bufferRestIndex),
						);

						if (resultChunk !== true) {
							return await treatError(resultChunk);
						}

						currentBuffer = currentBuffer.subarray(bufferRestIndex);
					}

					break;
				} else if (startPartIndex !== -1 && endHeaderPartIndex === -1) {
					// check if buffer contain start of header but not contain end
					break;
				} else {
					// check if buffer contain only end of header part
					return await treatError(new BodyParseFormDataError("Wrong content."));
				}
			}
		}

		if (currentBuffer.indexOf(endMultiPart) === -1) {
			const resultChunk = await flushReceiveChunk(
				currentBuffer.subarray(0, 2),
			);

			if (resultChunk !== true) {
				return await treatError(resultChunk);
			}
		}

		valueAccumulator = await currentStream?.onEndPart(valueAccumulator) ?? valueAccumulator;

		return valueAccumulator;
	} catch (error) {
		await currentStream?.onError?.(error, valueAccumulator);
		return DEither.left("server-error", error);
	} finally {
		request.destroy();
	}
}
