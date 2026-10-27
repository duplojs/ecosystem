import { PredictedResponse, ResponseHelper } from '../response';
import { Floor } from './floor';
import type * as DDataStructure from "@duplojs/lang/dataStructure";
export interface ExtractStepOtherwiseParams<GenericFloor extends Floor = Floor> {
    response: ResponseHelper.Methods400;
    floor: GenericFloor;
    dataStructureError: DDataStructure.Error | Error;
}
export type ExtractOtherwise<GenericFloor extends Floor = Floor, GenericResponse extends PredictedResponse = PredictedResponse> = (params: ExtractStepOtherwiseParams<GenericFloor>) => GenericResponse;
