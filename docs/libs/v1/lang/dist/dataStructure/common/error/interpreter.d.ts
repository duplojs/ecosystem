import { Structure, Structures } from '../../structure';
import { Type, Types } from '../../type';
import { Constraint, Constraints } from '../../constraint';
import { Error, DecodeIssue, EncodeIssue, Issue } from './base';
import { Codec } from '../codec';
import * as DKind from '../../../kind';
import * as DCommon from '../../../common';
export interface InterpretedMessage {
    source?: string;
    interpretedSource?: string;
    subSource?: string;
    interpretedSubSource?: string;
}
export interface InterpretedIssue extends Issue {
    interpretedMessage: InterpretedMessage;
}
export interface InterpretedEncodedIssue extends EncodeIssue {
    interpretedMessage: InterpretedMessage;
}
export interface InterpretedDecodedIssue extends DecodeIssue {
    interpretedMessage: InterpretedMessage;
}
export type InterpretedIssues = (InterpretedIssue | InterpretedEncodedIssue | InterpretedDecodedIssue);
export type StructureDictionaryParams = DCommon.SimplifyTopLevel<Omit<{
    [DataStructure in (Types | Structures | Constraints) as DKind.GetName<DataStructure>]?: (structure: DataStructure, issue: Issue) => string;
}, DKind.GetName<Type> | DKind.GetName<Structure> | DKind.GetName<Constraint>>>;
export type CodecDictionaryParams = [
    Codec,
    (codec: Codec, issue: EncodeIssue | DecodeIssue) => string
][];
export declare function createErrorInterpreter(structureDictionary?: StructureDictionaryParams, codecDictionary?: CodecDictionaryParams): (error: Error) => readonly InterpretedIssues[];
export type ErrorInterpreter = ReturnType<typeof createErrorInterpreter>;
