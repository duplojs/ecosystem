import { ResponseContract } from '../response';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export declare const defaultNotfoundHandler: import('../steps').HandlerStep<{
    responseContract: NoInfer<ResponseContract.Contract<"404", "notfound-route", DDataStructure.TypeStructure<string, readonly []>>>;
    theFunction: (floor: import('..').Floor, { request, response }: import('../steps').HandlerStepFunctionParams<import('../response').PredictedResponses>) => never;
    metadata: never[];
}>;
