import type * as DCommon from '../common';
import * as DEither from '../either';
export interface Evidence<GenericName extends string = string> extends DCommon.DynamicConstraint<"evidence", GenericName> {
}
/**
 * {@include clean/evidence/index.md}
 */
export declare function appendEvidence<GenericInput extends unknown, GenericEvidenceName extends string>(input: GenericInput, evidenceName: GenericEvidenceName): GenericInput & Evidence<GenericEvidenceName>;
export declare function appendEvidence<GenericInput extends unknown, GenericEvidenceName extends string>(evidenceName: GenericEvidenceName): (input: GenericInput) => GenericInput & Evidence<GenericEvidenceName>;
export interface EvidenceResult<GenericInformation extends string, GenericValue extends unknown> extends DEither.Result<GenericInformation, GenericValue & Evidence<GenericInformation>> {
}
/**
 * {@include clean/evidenceResult/index.md}
 */
export declare function evidenceResult<GenericInformation extends string, GenericValue extends object>(information: GenericInformation): (value: GenericValue) => EvidenceResult<GenericInformation, GenericValue>;
export declare function evidenceResult<GenericInformation extends string, GenericValue extends object>(information: GenericInformation, value: GenericValue): EvidenceResult<GenericInformation, GenericValue>;
export type FindEvidence<GenericValue extends unknown> = (GenericValue extends Evidence ? GenericValue : GenericValue extends Promise<unknown> ? FindEvidence<Awaited<GenericValue>> : GenericValue extends DEither.Right | DEither.Left ? FindEvidence<DEither.GetValue<GenericValue>> : GenericValue extends Generator<infer InferredYeldValue, infer InferredResult> ? (FindEvidence<InferredYeldValue> | FindEvidence<InferredResult>) : GenericValue extends AsyncGenerator<infer InferredYeldValue, infer InferredResult> ? (FindEvidence<InferredYeldValue> | FindEvidence<InferredResult>) : never) extends infer InferredResult extends Evidence ? InferredResult : never;
export type GetEvidenceResult<GenericFunction extends DCommon.AnyFunction, EvidenceName extends Extract<keyof FindEvidence<ReturnType<GenericFunction>>[DCommon.ConstraintSymbol]["evidence"], string>> = Extract<FindEvidence<ReturnType<GenericFunction>>, EvidenceName extends unknown ? Evidence<EvidenceName> : never>;
