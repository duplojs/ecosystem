import { AnyValue } from './types';
interface LoopOutputExitResult<GenericOutput extends AnyValue> {
    "-exitData": GenericOutput;
}
interface LoopOutputNextResult<GenericOutput extends AnyValue> {
    "-nextData": GenericOutput;
}
export interface LoopParams<GenericNextOutput extends AnyValue> {
    count: number;
    previousOutput: GenericNextOutput | undefined;
    next<GenericValue extends GenericNextOutput | undefined = undefined>(output?: GenericValue): LoopOutputNextResult<GenericValue>;
    exit<GenericOutput extends AnyValue = undefined>(output?: GenericOutput): LoopOutputExitResult<GenericOutput>;
}
export declare function loop<GenericExitOutput extends AnyValue = undefined, GenericNextOutput extends AnyValue = undefined>(callback: (params: LoopParams<GenericNextOutput>) => LoopOutputNextResult<GenericNextOutput> | LoopOutputExitResult<GenericExitOutput>): GenericExitOutput;
export {};
