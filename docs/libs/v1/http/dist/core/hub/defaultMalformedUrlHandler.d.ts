import { ResponseContract } from '../response';
export declare const defaultMalformedUrlHandler: import('../steps').HandlerStep<{
    responseContract: NoInfer<ResponseContract.Contract<"400", "malformed-url", import('@duplojs-v1/lang/dataStructure').TypeStructure<undefined, readonly []>>>;
    theFunction: (__: import('..').Floor, { response }: import('../steps').HandlerStepFunctionParams<import('../response').PredictedResponses>) => never;
    metadata: never[];
}>;
