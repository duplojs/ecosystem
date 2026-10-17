import { Option } from '../base';
import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
export declare const booleanOptionKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-boolean-option", unknown>>;
export interface BooleanOption<GenericName extends string = string> extends DCommon.Forward<Option<GenericName, boolean> & DKind.Kind<typeof booleanOptionKind>> {
}
export interface CreateBooleanOptionParams {
    description?: string;
    aliases?: readonly string[];
}
export declare const createBooleanOption: <GenericName extends string>(name: GenericName, params?: CreateBooleanOptionParams) => NoInfer<BooleanOption<GenericName>>;
