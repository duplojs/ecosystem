import { type ExtractShape, extractStepKind } from "@core/steps";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DObject from "@duplojs/lang/object";
import * as DPattern from "@duplojs/lang/pattern";
import { type Request } from "@core/request";
import { PredictedResponse } from "@core/response";
import { type Floor } from "@core/types";
import { createStepFunctionBuilder } from "../create";

type Extractor = (request: Request, floor: Floor) => DCommon.MaybePromise<PredictedResponse | Floor>;

export const defaultExtractStepFunctionBuilder = createStepFunctionBuilder(
	extractStepKind.has,
	(step, { success, environment, defaultExtractContract, defaultCodecs }) => {
		const {
			shape,
			responseContract: stepResponseContract,
		} = step.definition;

		const responseContract = stepResponseContract ?? defaultExtractContract;

		function createExtractor(
			structure: DDataStructure.Structure,
			key: keyof ExtractShape,
			subKey: string | undefined,
		): Extractor {
			const createResponse = environment === "DEV"
				? (result: unknown) => new PredictedResponse(
					responseContract.code,
					responseContract.information,
					result,
				)
				: () => new PredictedResponse(responseContract.code, responseContract.information, undefined);
			const setHeader = subKey === undefined || key === "body"
				? (response: PredictedResponse) => response.setHeader("extract-key", `request.${key}`)
				: (response: PredictedResponse) => response.setHeader("extract-key", `request.${key}.${subKey}`);
			const getResponse = (result: unknown) => setHeader(createResponse(result));
			const treatResult = (result: DEither.Left | DEither.Right, floor: Floor) => DEither.isLeft(result)
				? getResponse(DEither.unwrapLeft(result))
				: {
					...floor,
					[subKey ?? key]: DEither.unwrapRight(result),
				};

			const getValue = typeof subKey === "string"
				? (value: unknown) => value?.[subKey as never]
				: DCommon.forward;

			if (key === "body") {
				const parseFunction = structure.isAsynchronous()
					? structure.asyncParse
					: structure.parse;
				return async(request: Request, floor: Floor) => {
					const bodyResult = await request
						.getBodyResult()
						.extract(
							getValue,
							parseFunction,
						);

					return treatResult(
						bodyResult,
						floor,
					);
				};
			}

			if (structure.isAsynchronous()) {
				const parseFunction = structure.asyncParse;
				return async(request: Request, floor: Floor) => {
					const result = await parseFunction(getValue(request[key]), defaultCodecs[key]);
					return treatResult(result, floor);
				};
			}

			const parseFunction = structure.parse;
			return (request: Request, floor: Floor) => {
				const result = parseFunction(getValue(request[key]), defaultCodecs[key]);
				return treatResult(result, floor);
			};
		}

		const extractors = DArray.reduce(
			DObject.entries(shape),
			DArray.reduceFrom<readonly Extractor[]>([]),
			({
				lastValue,
				element: [key, value],
				next,
			}) => DCommon.pipe(
				value,
				DPattern.when(
					DDataStructure.structureKind.has,
					(value) => DArray.push(
						lastValue,
						createExtractor(
							value,
							key,
							undefined,
						),
					),
				),
				DPattern.otherwise(
					(value) => DCommon.pipe(
						value,
						DPattern.when(
							DCommon.isType("undefined"),
							DCommon.justReturn(lastValue),
						),
						DPattern.otherwise(
							DCommon.innerPipe(
								DObject.entries,
								DArray.map(
									([subKey, subValue]) => createExtractor(
										subValue,
										key,
										subKey,
									),
								),
								(subExtractor) => DArray.concat(lastValue, subExtractor),
							),
						),
					),
				),
				next,
			),
		);

		return success({
			buildedFunction: async(request, floor) => {
				let newFloor = floor;

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let index = 0; index < extractors.length; index++) {
					const result = await extractors[index]!(request, newFloor);

					if (result instanceof PredictedResponse) {
						return result;
					}

					newFloor = result;
				}

				return newFloor;
			},
			hooksRouteLifeCycle: [],
		});
	},
);
