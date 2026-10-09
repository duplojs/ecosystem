import type * as DCommon from '../common';
import type * as DString from '../string';
export interface Definition<GenericName extends string = string, GenericValue extends unknown = unknown> {
    name: GenericName;
    value: GenericValue;
}
export interface Handler<GenericKindDefinition extends Definition = Definition> {
    definition: GenericKindDefinition;
    runTimeKey: string;
    has<GenericInput extends unknown>(input: GenericInput): input is Extract<GenericInput, Kind<this, GenericKindDefinition["value"]>>;
    addTo<GenericInput extends {}, GenericValue extends GenericKindDefinition["value"] = GenericKindDefinition["value"]>(input: GenericInput, value: GenericValue): (Kind<this, GenericValue> & DCommon.BreakGenericLink<GenericInput>);
    /**
     * @deprecated This method make mutation.
     */
    setTo<GenericInput extends {}, GenericValue extends GenericKindDefinition["value"] = GenericKindDefinition["value"]>(input: GenericInput, value: GenericValue): (Kind<this, GenericValue> & DCommon.BreakGenericLink<GenericInput>);
    getValue<GenericKind extends Kind<this, GenericKindDefinition["value"]>>(input: GenericKind): GenericKind[KeySymbol][GenericKindDefinition["name"]];
}
declare const KeySymbol: unique symbol;
export type KeySymbol = typeof KeySymbol;
export interface Kind<GenericHandler extends Handler, GenericValue extends GenericHandler["definition"]["value"] = GenericHandler["definition"]["value"]> {
    [KeySymbol]: {
        [Prop in GenericHandler["definition"]["name"]]: GenericValue;
    };
}
export declare const keyKindPrefix = "@duplojs-v1/lang/kind/";
export type ForbiddenKindNameCharacter = "@" | "/";
export declare function create<GenericName extends string, GenericKindValue extends unknown = unknown>(name: (GenericName & DString.ForbiddenContain<GenericName, ForbiddenKindNameCharacter>)): Handler<Definition<GenericName, GenericKindValue>>;
export declare function isRuntimeKey(value: string): boolean;
export {};
