import { Error, SymbolCommandError } from './error';
import { EligibleType } from './types';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export declare const argumentKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-argument", unknown>>;
export interface Argument<GenericName extends string = string, GenericValue extends EligibleType = EligibleType> extends DKind.Kind<typeof argumentKind> {
    readonly name: GenericName;
    readonly dataStructure: DDataStructure.Structure<GenericValue>;
    readonly optional: boolean;
    readonly description: string | null;
    execute(argument: string | undefined, error: Error): Promise<GenericValue | SymbolCommandError>;
}
export interface CreateArgumentParams {
    readonly description?: string;
    readonly optional?: boolean;
}
export declare function createArgument<GenericName extends string, GenericStructure extends DDataStructure.Structure<EligibleType>, GenericValue extends DDataStructure.StructureValue<GenericStructure>, const GenericParams extends CreateArgumentParams = {}>(name: GenericName, dataStructure: GenericStructure, params?: GenericParams): Argument<GenericName, (GenericValue | (DCommon.IsEqual<GenericParams["optional"], true> extends true ? undefined : never))>;
