import { LoopParams } from './loop';
import { AnyValue } from './types';
interface LoopOutputExitResult<GenericOutput extends AnyValue> {
    "-exitData": GenericOutput;
}
interface LoopOutputNextResult<GenericOutput extends AnyValue> {
    "-nextData": GenericOutput;
}
export declare function asyncLoop<GenericExitOutput extends AnyValue = undefined, GenericNextOutput extends AnyValue = undefined>(callback: (params: LoopParams<GenericNextOutput>) => Promise<LoopOutputNextResult<GenericNextOutput | undefined> | LoopOutputExitResult<GenericExitOutput>>): Promise<GenericExitOutput>;
export {};
